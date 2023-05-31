const express = require('express');
const router = express.Router();
const diagnosedController = require("../controllers/diagnosedConditions")

// GET all users
router.get('/getAllDiagnosedConditions', diagnosedController.getAllDiagnosedConditions);
router.get('/getDiagnosedConditionById/:id', diagnosedController.getDiagnosedConditionById);
router.post('/addDiagnosedCondition', diagnosedController.createDiagnosedConditions);
router.post('/addManyDiagnosedCondition', diagnosedController.createManyDiagnosedConditions);
router.put('/updateDiagnosedCondition', diagnosedController.updateDiagnosedConditions);
router.delete('/deleteDiagnosedCondition/:id', diagnosedController.deleteDiagnosedCondition);
router.get('/searchDiagnosedCondition/:query', diagnosedController.searchDiagnosedCondition);

module.exports = router;
