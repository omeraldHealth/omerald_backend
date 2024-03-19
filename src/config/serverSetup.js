const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const routeUsage = require('./../utils/routeUsage');
const { authenticateAPIUser } = require('../api/v1/controllers/authentication');
const { authenticateToken } = require('../utils/middleware');

function setupServer(port) {
  const app = express();

  // CORS setup
  const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Middleware setup
  app.use(express.json());
  app.use(compression());
 // Public route
 app.post('/api/v1/auth/getAuthToken', authenticateAPIUser);

 // Apply JWT authentication to all subsequent routes
 app.use(authenticateToken);
 app.use(routeUsage);

  // Set CORS headers
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', 'default-src *');
    next();
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Mongoose connection setup
  const mongodbURI = process.env.MONGODB_URI;
  connectToMongoDB(mongodbURI);

  return app;
}

module.exports = setupServer;
