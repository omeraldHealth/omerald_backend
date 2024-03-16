const jwt = require('jsonwebtoken');
const MemoryCache = require('memory-cache').Cache;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Create a new instance of MemoryCache
const memoryCache = new MemoryCache();

/**
 * Middleware to authenticate tokens.
 * Verifies the JWT token from the Authorization header.
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer [TOKEN]

  // No token found in the header
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden - Invalid token
    }
    req.user = user; // Attach the user payload to the request object
    next();
  });
};

/**
 * Middleware for caching responses and serving cached content.
 * Caches successful responses and retrieves them for subsequent requests.
 */
exports.cacheMiddleware = (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`;
  const cachedBody = memoryCache.get(key);

  // Serve from cache if available
  if (cachedBody) {
    res.setHeader('Content-Type', 'application/json'); // Ensure JSON response
    return res.send(cachedBody);
  }

  // Override res.send for capturing and caching the response
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    // Cache the response if the status code indicates success
    if (res.statusCode === 200) {
      memoryCache.put(key, body, CACHE_DURATION);
    }
    originalSend(body);
  };
  next();
};
