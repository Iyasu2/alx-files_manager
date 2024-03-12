/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import { MongoClient } from 'mongodb';

const userQueue = new Queue('email sending');

const URL = 'mongodb://localhost:27017';
const DB_NAME = 'files_manager';

let dbClient = null;

async function getDBClient() {
  if (!dbClient) {
    dbClient = await MongoClient.connect(URL, { useUnifiedTopology: true });
  }
  return dbClient;
}

const db = async () => (await getDBClient()).db(DB_NAME);

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }

    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const usersCollection = (await db()).collection('users');
    const user = await usersCollection.findOne({ email });

    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }

    const insertionInfo = await usersCollection.insertOne({
      email,
      password: sha1(password),
    });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add({ userId });

    res.status(201).json({ email, id: userId });
  }

  static async getMe(req, res) {
    const { user } = req;
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
