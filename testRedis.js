// testRedis.js
const { createClient } = require('redis');

(async () => {
    const redisClient = createClient({
        url: 'redis://localhost:6379'
    });

    try {
        await redisClient.connect();
        console.log('Connected to Redis');

        await redisClient.set('testKey', 'testValue');
        const value = await redisClient.get('testKey');

        console.log('Value for testKey:', value); // Should output 'testValue'
    } catch (error) {
        console.error('Redis error:', error);
    } finally {
        await redisClient.quit();
    }
})();
