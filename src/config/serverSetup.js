const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('./../utils/middleware').authenticateToken;
const authenticateAPIUser = require('./../api/v1/controllers/authentication').authenticateAPIUser;
const routeUsage = require('./../utils/routeUsage');

// Configure CORS options for a list of whitelisted domains
const configureCORSOptions = () => {
  const whitelist = [
    'http://localhost',
    'https://admin-omerald-dev.vercel.app',
    'https://admin-omerald-qa.vercel.app',
    'https://admin-omerald.vercel.app',
    'https://admin.omerald.com',
  ];
  
  return {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionSuccessStatus: 200,
  };
};

// Setup rate limiting to prevent abuse
const setupRateLimiting = () => rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 250, // Limit each IP to 250 requests per windowMs
});

// Initialize and configure the Express application
function setupServer(port) {
  const app = express();

  // Middleware setup for security and performance
  app.use(cors(configureCORSOptions()));
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  
  // Setup security policies
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });

  // Apply rate limiting middleware
  app.use(setupRateLimiting());

  // Define public and authenticated routes
  app.post('/api/v1/auth/getAuthToken', authenticateAPIUser);
  app.use(authenticateToken); // Apply JWT authentication to all routes below this line
  app.use(routeUsage);
  
  // MongoDB connection
  connectToMongoDB(process.env.MONGODB_URI);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

module.exports = setupServer;
