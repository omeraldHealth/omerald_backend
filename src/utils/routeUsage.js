const express = require('express');
const routeImports = require('./routes'); // Assuming this contains your route definitions
// const { cacheMiddleware } = require('./middleware');

const router = express.Router();
const API_PREFIX = '/api/v1';

// Define your route configurations
const routeConfig = [
    { path: '/users', route: routeImports.userRoutes },
    { path: '/diagnosedConditions', route: routeImports.diagnosedConditionRoutes },
    { path: '/doseDuration', route: routeImports.doseDurationRoutes },
    { path: '/doses', route: routeImports.dosesRoutes },
    { path: '/vaccine', route: routeImports.vaccineRoutes },
    { path: '/parameter', route: routeImports.parameterRouter },
    { path: '/reports', route: routeImports.reportRouter },
    { path: '/samples', route: routeImports.sampleRouter },
    { path: '/userSettings', route: routeImports.userSettingRouter },
    { path: '/diagSettings', route: routeImports.diagSettingRouter },
    { path: '/health', route: routeImports.healthRouter },
    { path: '/activity', route: routeImports.activityRouter },
    { path: '/category', route: routeImports.categoryRouter },
    { path: '/diagnosticLanding', route: routeImports.diagLandingRouter },
];


// Apply cache middleware and set up routes dynamically
routeConfig.forEach(({ path, route }) => {
  router.use(`${API_PREFIX}${path}`, route);
});

module.exports = router;
