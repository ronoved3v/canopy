import Redis from "ioredis";
import redisConfig from "../../../../config/redis.js";
class RedisHelper {
	constructor() {
		this.redis = new Redis(redisConfig);
	}

	async get(key) {
		try {
			const result = await this.redis.get(key);
			return result;
		} catch (error) {
			console.error(`Error getting value from Redis: ${error}`);
			throw error;
		}
	}

	async set(key, value) {
		try {
			await this.redis.set(key, value);
		} catch (error) {
			console.error(`Error setting value in Redis: ${error}`);
			throw error;
		}
	}

	async del(key) {
		try {
			await this.redis.del(key);
		} catch (error) {
			console.error(`Error deleting value from Redis: ${error}`);
			throw error;
		}
	}

	async keys(pattern) {
		try {
			const keys = await this.redis.keys(pattern);
			return keys;
		} catch (error) {
			console.error(`Error getting keys from Redis: ${error}`);
			throw error;
		}
	}
}

const redis = new RedisHelper();

export default redis;
