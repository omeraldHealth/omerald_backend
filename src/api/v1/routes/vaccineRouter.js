const express = require('express');
const router = express.Router();
const vaccineController = require("../controllers/vaccines")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllVaccine', vaccineController.getVaccine);
router.post('/addVaccine', vaccineController.createVaccine);
router.post('/addManyVaccine', upload.single("file"), vaccineController.createManyVaccines);
router.put('/updateVaccine', vaccineController.updateVaccine);
router.delete('/deleteVaccine/:id', vaccineController.deleteVaccine);
router.post('/getAllVaccineByIds', vaccineController.getVaccinesByIds);

module.exports = router;
