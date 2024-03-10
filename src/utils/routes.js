const userRoutes = require("../api/v1/routes/userRouter");
const analysedParamRoutes = require("../api/v1/routes/analysedParamRouter");
const diagnosedConditionRoutes = require("../api/v1/routes/diagnosedCondition");
const doseDurationRoutes = require("../api/v1/routes/doseDurationRouter");
const dosesRoutes = require("../api/v1/routes/dosesRouter");
const vaccineRoutes = require("../api/v1/routes/vaccineRouter");
const ignoredParamRouter = require("../api/v1/routes/ignoredParamRouter");
const parameterRouter =  require("../api/v1/routes/parameterRouter");
const reportRouter = require("../api/v1/routes/reportRouter");
const sampleRouter = require("../api/v1/routes/sampleRoutes");
const userSettingRouter = require("../api/v1/routes/userSettingRouter");
const diagSettingRouter = require("../api/v1/routes/diagnosticSettingRouter");
const healthRouter = require("../api/v1/routes/healthRoute");
const activityRouter = require("../api/v1/routes/activityRouter");
const categoryRouter = require("../api/v1/routes/categoryRouter");

module.exports = {
  userRoutes,
  analysedParamRoutes,
  diagnosedConditionRoutes,
  doseDurationRoutes,
  dosesRoutes,
  vaccineRoutes,
  ignoredParamRouter,
  parameterRouter,
  reportRouter,
  sampleRouter,
  userSettingRouter,
  diagSettingRouter,
  healthRouter,
  activityRouter,
  categoryRouter
};
