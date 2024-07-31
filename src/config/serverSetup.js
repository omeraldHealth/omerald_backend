const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectToMongoDB = require('./mongooseSetup');
const routeUsage = require('./../utils/routeUsage');
const { authenticateAPIUser } = require('../api/v1/controllers/authentication');
const { authenticateToken } = require('../utils/middleware');

function setupServer(port) {
  const app = express();

  const corsOptions = {
    origin: "*",
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browsers
    maxAge: 86400 // 24 hours
  };
  app.use(cors(corsOptions));

  app.options('*', cors(corsOptions));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

  // Middleware setup
  app.use(express.json());
  app.use(compression());

  // Example route
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });


  
  // Public route
  // app.post('/api/v1/auth/getAuthToken', authenticateAPIUser);

  // Apply JWT authentication to all subsequent routes
  // app.use(authenticateToken);
  
  // Route usage tracking
  app.use(routeUsage);

  // It's best practice to define your security headers within the cors options or specifically for routes as needed.
  // Removing the manual CORS header settings here to avoid conflict with the cors middleware

  // MongoDB connection setup
  connectToMongoDB(process.env.MONGODB_URI);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

module.exports = setupServer;
