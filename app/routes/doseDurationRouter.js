const express = require('express');
const router = express.Router();
const doseDurationController = require("../controllers/doseDuration")

// GET all users
router.get('/getAllDoseDuration', doseDurationController.getDoseDuration);
router.post('/addDoseDuration', doseDurationController.createDoseDuration);
router.post('/addManyDoseDuration', doseDurationController.createManyDoseDuration);
router.post('/updateDoseDuration', doseDurationController.updateDoseDuration);
router.post('/deleteDoseDuration', doseDurationController.deleteDoseDuration);

module.exports = router;
