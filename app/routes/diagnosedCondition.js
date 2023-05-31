const express = require('express');
const router = express.Router();
const diagnosedController = require("../controllers/diagnosedConditions")

// GET all users
router.get('/getAllDiagnosedConditions', diagnosedController.getAllDiagnosedConditions);
router.post('/addDiagnosedCondition', diagnosedController.createDiagnosedConditions);
router.post('/addManyDiagnosedCondition', diagnosedController.createManyDiagnosedConditions);
router.put('/updateDiagnosedCondition', diagnosedController.updateDiagnosedConditions);
router.put('/deleteDiagnosedCondition', diagnosedController.deleteDiagnosedCondition);
router.put('/searchDiagnosedCondition', diagnosedController.searchDiagnosedCondition);

module.exports = router;
