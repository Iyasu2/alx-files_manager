import mongodb from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  async usersCollection() {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    return this.client.db().collection('users');
  }

  async filesCollection() {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;

