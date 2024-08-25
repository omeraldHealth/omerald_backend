const setupServer = require('./src/config/serverSetup');

const app = setupServer(process.env.PORT || 8080);

module.exports = app; 