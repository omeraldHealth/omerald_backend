const express = require('express');
const router = express.Router();
const doseController = require("../controllers/doses")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllDoses', doseController.getAlldosess);
router.post('/addDose', doseController.createdosess);
router.post('/addManyDoses', upload.single("file"), doseController.createManyDoses);
router.put('/updateDose', doseController.updatedosess);
router.delete('/deleteDose/:id', doseController.deletedoses);
router.post('/getAllDosesByIds/:id', doseController.getDosesByIds);

module.exports = router;
