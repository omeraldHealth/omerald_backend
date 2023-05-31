const express = require('express');
const router = express.Router();
const doseController = require("../controllers/doses")

// GET all users
router.get('/getAllDoses', doseController.getAlldosess);
router.post('/addDose', doseController.createdosess);
router.post('/addManyDoses', doseController.createManydosess);
router.put('/updateDose', doseController.updatedosess);
router.delete('/deleteDose/:id', doseController.deletedoses);

module.exports = router;
