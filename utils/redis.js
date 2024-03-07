// utils/redis.js

import redis from 'redis';

class RedisClient {
    constructor() {
        try {
            // Create a Redis client
            this.client = redis.createClient(6379, 'localhost', { decode_responses: true });
            this.client.on('error', (err) => {
                console.error(`Error connecting to Redis: ${err}`);
                this.client = null;
            });
        } catch (e) {
            console.error(`Error creating Redis client: ${e}`);
            this.client = null;
        }
    }

    isAlive() {
        /**
         * Returns true if the connection to Redis is successful, otherwise false.
         */
        return this.client !== null;
    }

    async get(key) {
        /**
         * Retrieves the value stored in Redis for the given key.
         */
        return new Promise((resolve) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    console.error(`Error getting value for key ${key}: ${err}`);
                    resolve(null);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async set(key, value, duration) {
        /**
         * Stores the value in Redis with an expiration set by the duration argument (in seconds).
         */
        await this.client.setex(key, duration, value);
    }

    async del(key) {
        /**
         * Removes the value in Redis for the given key.
         */
        await this.client.del(key);
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
