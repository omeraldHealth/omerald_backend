const express = require('express');
const router = express.Router();
const diagnosticSetting = require("../controllers/diagnosticSettings")

// GET all Diagnostics
router.get('/getDiagnosticSetting', diagnosticSetting.getDiagnosticSetting);
router.post('/addDiagnosticSetting', diagnosticSetting.createDiagnosticSetting);
router.put('/updateDiagnosticSetting', diagnosticSetting.updateDiagnosticSetting);

module.exports = router;
