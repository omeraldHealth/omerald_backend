const express = require('express');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const userRoutes = require("./app/routes/userRouter")
const mongodbURI = "mongodb+srv://omerald_admin_user:cGL2eu2vq9CiVlI0@admincluster.tljywn6.mongodb.net/omerald_admin?retryWrites=true&w=majority";

// ******************************************** MiddlWare ****************************************************************************************
// Middleware
app.use(express.json());
app.use(cors());

//Enable gzip compression
app.use(compression());
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/users', userRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Omerald Express!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ********************************************** Mongoose **************************************************************************************

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

// Gracefully close the MongoDB connection on application termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
});


// ************************************************************************************************************************************


