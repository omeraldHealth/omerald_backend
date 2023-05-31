const express = require('express');
const router = express.Router();
const vaccineController = require("../controllers/vaccines")

// GET all users
router.get('/getAllVaccine', vaccineController.getVaccine);
router.post('/addVaccine', vaccineController.createVaccine);
router.post('/addManyVaccine', vaccineController.createManyVaccine);
router.put('/updateVaccine', vaccineController.updateVaccine);
router.delete('/deleteVaccine/:id', vaccineController.deleteVaccine);

module.exports = router;
