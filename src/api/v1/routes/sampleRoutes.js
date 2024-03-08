const express = require('express');
const router = express.Router();
const samplesController = require("../controllers/sample")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllSamples', samplesController.getSample);
router.post('/addSample', samplesController.createSample);
router.post('/addManySamples',upload.single("file"), samplesController.createManySamples);
router.put('/updateSample', samplesController.updateSample);
router.delete('/deleteSample/:id', samplesController.deleteSample);

module.exports = router;
