const express = require('express');
const router = express.Router();
const ignoredParamController = require("../controllers/IgnoredParam")

// GET all users
router.get('/getAllignoredParam', ignoredParamController.getignoredParams);
router.post('/addignoredParam', ignoredParamController.createignoredParams);
router.post('/addManyignoredParam', ignoredParamController.createManyignoredParams);
router.put('/updateignoredParam', ignoredParamController.updateignoredParams);
router.delete('/deleteignoredParam/:id', ignoredParamController.deleteignoredParams);

module.exports = router;
