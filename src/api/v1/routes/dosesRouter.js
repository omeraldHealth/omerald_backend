const express = require('express');
const router = express.Router();
const doseController = require("../controllers/doses")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllDoses', doseController.getAllDoses);
router.post('/addDose', doseController.createDoses);
router.post('/addManyDoses', upload.single("file"), doseController.createManyDoses);
router.put('/updateDose', doseController.updateDoses);
router.delete('/deleteDose/:id', doseController.deleteDoses);
router.post('/getAllDosesByIds', doseController.getDosesByIds);

module.exports = router;
