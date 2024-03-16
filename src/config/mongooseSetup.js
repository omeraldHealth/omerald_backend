const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

/**
 * Connects to MongoDB using Mongoose.
 * @param {string} mongodbURI - MongoDB connection string.
 */
const connectToMongoDB = (mongodbURI) => {
  // Define connection options for Mongoose
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Limit the number of connections in the pool for better resource management.
  };

  // Initiate MongoDB connection
  mongoose.connect(mongodbURI, options).then(() => {
    console.log('Connected to MongoDB');
  }).catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

  // Listen for MongoDB connection errors after initial connection
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  // Log disconnection events for better monitoring
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });

  // Gracefully close the MongoDB connection when the application terminates
  process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

  /**
   * Handles graceful shutdown of the MongoDB connection.
   */
  function gracefulShutdown() {
    mongoose.connection.close(() => {
      console.log('MongoDB connection gracefully closed');
      process.exit(0);
    });
  }
};

module.exports = connectToMongoDB;
