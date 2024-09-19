class RateLimiter {
    constructor(options) {
        this.options = options;
        this.requests = new Map(); // Store requests in-memory
    }

    allowRequest(token, role) {
        const limit = this.options.roleLimits[role] || this.options.maxRequests;
        const currentTime = Date.now();
        const timeWindow = this.options.windowMs;

        // Initialize request count for this token
        if (!this.requests.has(token)) {
            this.requests.set(token, []);
        }

        const timestamps = this.requests.get(token);
        
        // Remove timestamps that are outside the time window
        const validTimestamps = timestamps.filter(timestamp => currentTime - timestamp < timeWindow);
        this.requests.set(token, validTimestamps);

        // Check if the limit is exceeded
        if (validTimestamps.length >= limit) {
            console.warn(`Rate limit exceeded for token: ${token}`);
            return false; // Block the request
        }

        // Allow the request and log the timestamp
        validTimestamps.push(currentTime);
        return true; // Allow the request
    }
}

module.exports = RateLimiter;
