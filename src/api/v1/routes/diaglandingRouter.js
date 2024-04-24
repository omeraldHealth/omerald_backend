const express = require('express');
const router = express.Router();
const diagLandingController = require("../controllers/diagLanding");

router.get('/getDiagLanding', diagLandingController.getLandingSettings);
router.post('/updateDiagLanding', diagLandingController.createOrUpdateLandingSettings);
router.put('/deleteDiagLanding/:id', diagLandingController.deleteLandingSettings);

module.exports = router;
