const express = require('express');
const router = express.Router();
const diagLandingController = require("../controllers/diagLanding");
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

router.get('/getDiagLanding', diagLandingController.getLandingSettings);
router.post('/updateDiagLanding', diagLandingController.createOrUpdateLandingSettings);
router.delete('/deleteDiagLanding', diagLandingController.deleteLandingSettings);
router.post('/uploadImage',upload.single("file"), diagLandingController.uploadDiagImages);
module.exports = router;
