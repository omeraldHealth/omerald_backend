const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const authenticateToken = require('./../utils/middleware').authenticateToken;
const authenticateAPIUser = require('./../api/v1/controllers/authentication').authenticateAPIUser;
const routeUsage = require('./../utils/routeUsage');

function setupServer(port) {
  const app = express();

  // CORS setup corrected
  const corsOptions = {
    origin: '*', // Consider specifying domains in production
    credentials: true,
    optionsSuccessStatus: 200 // Corrected typo
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Enable pre-flight across-the-board

  // Middleware setup
  app.use(express.json());
  app.use(compression());
  app.use(routeUsage); // Log route usage
  
  // Set Security headers more securely and specifically if possible
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    // Consider specifying your content sources rather than '*'
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://apis.example.com");
    next();
  });

  // Define public and authenticated routes
  app.post('/api/v1/auth/getAuthToken', authenticateAPIUser);

  // Apply JWT authentication middleware only to specific routes to avoid locking down the whole API
  // app.use(authenticateToken); // Example path to secure
  // All secure routes go under /api/v1/secure

  // MongoDB connection
  connectToMongoDB(process.env.MONGODB_URI);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Error handling middleware - Basic example
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  return app;
}

module.exports = setupServer;
