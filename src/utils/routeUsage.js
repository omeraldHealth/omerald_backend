const express = require('express');
const routeImports = require('./routes');

const router = express.Router();

router.use('/api/v1/users', routeImports.userRoutes);
router.use('/api/v1/analysedParams', routeImports.analysedParamRoutes);
router.use('/api/v1/diagnosedConditions', routeImports.diagnosedConditionRoutes);
router.use('/api/v1/doseDuration', routeImports.doseDurationRoutes);
router.use('/api/v1/doses', routeImports.dosesRoutes);
router.use('/api/v1/vaccine', routeImports.vaccineRoutes);
router.use('/api/v1/ignoredParams', routeImports.ignoredParamRouter);
router.use('/api/v1/parameter', routeImports.parameterRouter);
router.use('/api/v1/reports', routeImports.reportRouter);
router.use('/api/v1/samples', routeImports.sampleRouter);
router.use('/api/v1/userSettings', routeImports.userSettingRouter);
router.use('/api/v1/diagSettings', routeImports.diagSettingRouter);
router.use('/api/v1/health', routeImports.healthRouter);
router.use('/api/v1/activity', routeImports.activityRouter);
router.use('/api/v1/category', routeImports.categoryRouter);

module.exports = router;
