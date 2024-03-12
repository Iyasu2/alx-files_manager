/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

const userQueue = new Queue('email sending');

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    try {
      const usersCollection = await dbClient.usersCollection();
      const user = await usersCollection.findOne({ email });

      if (user) {
        res.status(400).json({ error: 'Already exists' });
        return;
      }

      const insertionInfo = await usersCollection.insertOne({
        email,
        password: sha1(password),
      });

      const userId = insertionInfo.insertedId.toString();
      userQueue.add({ userId });

      res.status(201).json({ email, id: userId });
    } catch (error) {
      console.error('Error in postNew:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const { user } = req;

    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}

