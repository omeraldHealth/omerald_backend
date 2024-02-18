  const express = require('express');
  const compression = require('compression');
  const cors = require('cors');
  const mongoose = require('mongoose');
  require('dotenv').config();

  const userRoutes = require("./app/routes/userRouter")
  const analysedParamRoutes = require("./app/routes/analysedParamRouter")
  const diagnosedConditionRoutes = require("./app/routes/diagnosedCondition")
  const doseDurationRoutes = require("./app/routes/doseDurationRouter")
  const dosesRoutes = require("./app/routes/dosesRouter")
  const vaccineRoutes = require("./app/routes/vaccineRouter")
  const ignoredParamRouter = require("./app/routes/ignoredParamRouter")
  const parameterRouter =  require("./app/routes/parameterRouter")
  const reportRouter = require("./app/routes/reportRouter")
  const sampleRouter = require("./app/routes/sampleRoutes")
  const userSettingRouter = require("./app/routes/userSettingRouter")
  const diagSettingRouter = require("./app/routes/diagnosticSettingRouter")

  // ******************************************** MiddlWare ****************************************************************************************

  const app = express();
  const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(compression());

  app.options('*', cors(corsOptions));

  // Set CORS headers
  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', 'default-src *');
    next();
  });

  // Start the server
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Routes
  app.get('/', (req, res) => {
    res.send('Hello, Omerald Express!');
  });

  app.use('/users', userRoutes);
  app.use('/analysedParams', analysedParamRoutes);
  app.use('/diagnosedConditions', diagnosedConditionRoutes);
  app.use('/doseDuration', doseDurationRoutes);
  app.use('/doses', dosesRoutes);
  app.use('/vaccine', vaccineRoutes);
  app.use('/ignoredParams', ignoredParamRouter);
  app.use('/parameter', parameterRouter);
  app.use('/reports', reportRouter);
  app.use('/samples', sampleRouter);
  app.use('/userSettings',userSettingRouter)
  app.use('/diagSettings',diagSettingRouter)


  // ********************************************** Mongoose **************************************************************************************

  // Set up Mongoose connection pool
  const mongodbURI = "mongodb+srv://omerald_admin_stage:Omerald2024@admincluster.tljywn6.mongodb.net/omerald_admin?retryWrites=true&w=majority"

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



  module.exports = app;