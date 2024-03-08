const express = require('express');
const router = express.Router();
const reportController = require("../controllers/reports")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllReports', reportController.getReport);
router.post('/addReport', reportController.createReport);
router.post('/addManyReports',upload.single("file") , reportController.createManyReport);
router.put('/updateReport', reportController.updateReport);
router.delete('/deleteReport/:id', reportController.deletereport);

module.exports = router;
