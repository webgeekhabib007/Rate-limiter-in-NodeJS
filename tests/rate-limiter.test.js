const RateLimiter = require('../lib/rateLimiter');

describe('RateLimiter', () => {
    let limiter;

    beforeAll(() => {
        limiter = new RateLimiter({
            maxRequests: 5,
            windowMs: 60000, // 1 minute
            roleLimits: {
                admin: 10,
                user: 5,
            },
        });
    });

    beforeEach(() => {
        // Reset the requests map for each test
        limiter.requests = new Map();
    });

    test('allows a single request within limit', () => {
        const token = 'test-token';
        const role = 'user';

        const allowed = limiter.allowRequest(token, role);
        expect(allowed).toBe(true);
    });

    test('allows multiple requests up to the limit', () => {
        const token = 'test-token';
        const role = 'user';
        const maxRequests = limiter.options.maxRequests;

        for (let i = 0; i < maxRequests; i++) {
            const allowed = limiter.allowRequest(token, role);
            expect(allowed).toBe(true); // All should be allowed
        }
    });

    test('blocks requests over the limit', () => {
        const token = 'test-token';
        const role = 'user';
        const maxRequests = limiter.options.maxRequests;

        // Allow max requests
        for (let i = 0; i < maxRequests; i++) {
            limiter.allowRequest(token, role);
        }

        // Now the next request should be blocked
        const allowed = limiter.allowRequest(token, role);
        expect(allowed).toBe(false); // This request should be blocked
    });

    test('allows admin role more requests', () => {
        const token = 'admin-token';
        const role = 'admin';

        // Allow admin requests up to their limit
        for (let i = 0; i < limiter.options.roleLimits.admin; i++) {
            const allowed = limiter.allowRequest(token, role);
            expect(allowed).toBe(true); // All should be allowed
        }

        // Now the next request should be blocked
        const allowed = limiter.allowRequest(token, role);
        expect(allowed).toBe(false); // This request should be blocked
    });
});
