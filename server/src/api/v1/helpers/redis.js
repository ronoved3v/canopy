import Redis from "ioredis";

class RedisHelper {
	constructor() {
		this.redis = new Redis();
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
}

const redis = new RedisHelper();

export default redis;