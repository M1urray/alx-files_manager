import { promisify } from 'util';
import { createClient } from 'redis';
/**
* This class will represent our Redis client.
 */
class RedisClient {
    /**
     * Creates a new RedisClient instance.
     */
    constructor() {
        this.ClientConnected = false;
        this.client = createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
        this.setAsync = promisify(this.client.setex).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
        });
        this.client.on('connect', () => {
            this.ClientConnected = true;
        });
    }
    /**
     * Checks if this client's connection to the Redis server is active.
     * @returns {boolean}
     */
    isAlive() {
        return this.ClientConnected;
    }
    /**
   * Retrieves the value of a given key.
   * @param {String} key The key of the item to retrieve.
   * @returns {String | Object}
   */
    async get(key) {
        return this.getAsync(key);
    }
    /**
  * Stores a key and its value along with an expiration time.
  * @param {String} key The key of the item to store.
  * @param {String | Number | Boolean} value The item to store.
  * @param {Number} duration The expiration time of the item in seconds.
  * @returns {Promise<void>}
  */
    async set(key, value, duration) {
        await this.setAsync(key, duration, value);
    }
    /**
   * Removes the value of a given key.
   * @param {String} key The key of the item to remove.
   * @returns {Promise<void>}
   */
    async del(key) {
        await this.delAsync(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;