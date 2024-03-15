const express = require('express');
const router = express.Router();
const diagnosedController = require("../controllers/diagnosedConditions")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllDiagnosedConditions', diagnosedController.getAllDiagnosedConditions);
router.get('/getDiagnosedConditionById/:id', diagnosedController.getDiagnosedConditionById);
router.post('/addDiagnosedCondition', diagnosedController.createDiagnosedConditions);
router.post('/addManyDiagnosedCondition',  upload.single('file') , diagnosedController.createManyDiagnosedConditions);
router.put('/updateDiagnosedCondition', diagnosedController.updateDiagnosedConditions);
router.delete('/deleteDiagnosedCondition/:id', diagnosedController.deleteDiagnosedCondition);
router.get('/searchDiagnosedCondition/:query', diagnosedController.searchDiagnosedCondition);
router.post('/getDiagnosedConditionByIds', diagnosedController.getDiagnosedConditionsByIds);

module.exports = router;
