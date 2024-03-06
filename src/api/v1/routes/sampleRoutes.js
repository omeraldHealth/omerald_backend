const express = require('express');
const router = express.Router();
const samplesController = require("../controllers/sample")

// GET all users
router.get('/getAllSamples', samplesController.getSample);
router.post('/addSample', samplesController.createSample);
router.post('/addManySamples', samplesController.createManysample);
router.put('/updateSample', samplesController.updateSample);
router.delete('/deleteSample/:id', samplesController.deleteSample);

module.exports = router;
