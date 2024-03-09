const express = require('express');
const router = express.Router();
const doseDurationController = require("../controllers/doseDuration")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllDoseDuration', doseDurationController.getDoseDuration);
router.post('/addDoseDuration', doseDurationController.createDoseDuration);
router.post('/addManyDoseDuration', upload.single("file"), doseDurationController.createManyDoseDuration);
router.put('/updateDoseDuration', doseDurationController.updateDoseDuration);
router.delete('/deleteDoseDuration/:id', doseDurationController.deleteDoseDuration);

module.exports = router;
