const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const cors = require('cors');

require('dotenv').config();

const app = express();
const userRoutes = require("./app/routes/userRouter")
const mongodbURI = process.env.MONGODB_URI;

// Set up Mongoose connection pool
    mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Set the maximum number of connections in the pool
    // Other Mongoose options...
  });
  
  // Event listeners for Mongoose connection events
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow only requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these HTTP methods
    allowedHeaders: ['*'], // Allow only these headers
  })
);


//Enable gzip compression
app.use(compression());

app.use('/users', userRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Gracefully close the MongoDB connection on application termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
});