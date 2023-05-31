const express = require('express');
const router = express.Router();
const doseDurationController = require("../controllers/doseDuration")

// GET all users
router.get('/getAllDoseDuration', doseDurationController.getDoseDuration);
router.post('/addDoseDuration', doseDurationController.createDoseDuration);
router.post('/addManyDoseDuration', doseDurationController.createManyDoseDuration);
router.put('/updateDoseDuration', doseDurationController.updateDoseDuration);
router.delete('/deleteDoseDuration/:id', doseDurationController.deleteDoseDuration);

module.exports = router;
