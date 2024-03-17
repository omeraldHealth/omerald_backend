const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const authenticateToken = require('./../utils/middleware').authenticateToken;
const authenticateAPIUser = require('./../api/v1/controllers/authentication').authenticateAPIUser;
const routeUsage = require('./../utils/routeUsage');

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
  app.use(routeUsage);
  
  // Set CORS headers
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', 'default-src *');
    next();
  });

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

  // Mongoose connection setup
  const mongodbURI = process.env.MONGODB_URI;
  connectToMongoDB(mongodbURI);

  return app;
}

module.exports = setupServer;
