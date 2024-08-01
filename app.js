const setupServer = require('./src/config/serverSetup');

const app = setupServer(process.env.PORT || 3001);

module.exports = app; 