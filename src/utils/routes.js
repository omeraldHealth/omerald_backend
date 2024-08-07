const userRoutes = require("../api/v1/routes/userRouter");
const diagnosedConditionRoutes = require("../api/v1/routes/diagnosedCondition");
const doseDurationRoutes = require("../api/v1/routes/doseDurationRouter");
const dosesRoutes = require("../api/v1/routes/dosesRouter");
const vaccineRoutes = require("../api/v1/routes/vaccineRouter");
const parameterRouter =  require("../api/v1/routes/parameterRouter");
const reportRouter = require("../api/v1/routes/reportRouter");
const sampleRouter = require("../api/v1/routes/sampleRoutes");
const userSettingRouter = require("../api/v1/routes/userSettingRouter");
const diagSettingRouter = require("../api/v1/routes/diagnosticSettingRouter");
const healthRouter = require("../api/v1/routes/healthRoute");
const activityRouter = require("../api/v1/routes/activityRouter");
const categoryRouter = require("../api/v1/routes/categoryRouter");
const diagLandingRouter = require("../api/v1/routes/diaglandingRouter");

module.exports = {
  userRoutes,
  diagnosedConditionRoutes,
  doseDurationRoutes,
  dosesRoutes,
  vaccineRoutes,
  parameterRouter,
  reportRouter,
  sampleRouter,
  userSettingRouter,
  diagSettingRouter,
  healthRouter,
  activityRouter,
  categoryRouter,
  diagLandingRouter
};
