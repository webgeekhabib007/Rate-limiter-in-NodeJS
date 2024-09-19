const RateLimiter = require('./lib/rateLimiter');

const limiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 60000, // 1 minute
    roleLimits: {
        admin: 10,
        user: 5,
    },
});

// Example usage
async function testRateLimiting() {
    const token = 'test-token';
    const role = 'user';

    for (let i = 0; i < 7; i++) {
        const allowed = await limiter.allowRequest(token, role);
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }
}

testRateLimiting();
