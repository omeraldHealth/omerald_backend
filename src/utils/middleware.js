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

// Custom error response function
// createErrorResponse = (message, statusCode) => {
//   return {
//     error: true,
//     message: message,
//     statusCode: statusCode
//   };
// };

// Error handling middleware
// exports.errorHandler = (err, req, res, next) => {
//   let statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
//   let message = err.message || 'Internal Server Error';

//   // Log the error for debugging (optional)
//   console.error(err);

//   // Check for specific error types and modify the response accordingly
//   if (err instanceof CustomError) {
//     // Handle custom errors
//     statusCode = err.statusCode;
//     message = err.message;
//   } else if (err.name === 'ValidationError') {
//     // Handle validation errors
//     statusCode = 400; // Bad Request
//     message = err.message;
//   } else if (err.name === 'MongoError' && err.code === 11000) {
//     // Handle MongoDB duplicate key error
//     statusCode = 901; // Bad Request
//     message = 'Duplicate key error';
//   } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
//     // Handle MongoDB ObjectId casting error
//     statusCode = 901; // Not Found
//     message = 'Resource not found';
//   } // Add more else if blocks for handling different types of errors

//   // Send custom error response
//   res.status(statusCode).json(createErrorResponse(message, statusCode));
// };


