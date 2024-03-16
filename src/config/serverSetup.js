const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const routeUsage = require('./../utils/routeUsage');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('./../utils/middleware').authenticateToken;
const authenticateAPIUser = require('./../api/v1/controllers/authentication').authenticateAPIUser;

function setupServer(port) {
  const app = express();

  const whitelist = [
    'http://localhost',
    'https://admin-omerald-dev.vercel.app',
    'https://admin-omerald-qa.vercel.app',
    'https://admin-omerald.vercel.app',
    'https://admin.omerald.com',
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // Define the token generation endpoint
  app.post('/api/v1/auth/getAuthToken', (req, res) => {
    authenticateAPIUser(req, res);
  });
  
  // Middleware setup
  app.use(express.json());
  app.use(compression());
  app.use(helmet());
  app.use(authenticateToken);
  app.use(routeUsage);

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 250 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Set CORS headers
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', 'default-src *');
    next();
  });

  // Authentication middleware to check JWT
  app.use(authenticateToken);

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

