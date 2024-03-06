const express = require('express');
const router = express.Router();
const analysedParamController = require("../controllers/analysedParam")

// GET all users
router.get('/getAllParams', analysedParamController.getAnalysedParams);
router.post('/addParams', analysedParamController.createAnalysedParam);
router.post('/addManyParams', analysedParamController.createManyParam);

module.exports = router;
