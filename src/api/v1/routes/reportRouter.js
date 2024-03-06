const express = require('express');
const router = express.Router();
const reportController = require("../controllers/reports")

// GET all users
router.get('/getAllReports', reportController.getReport);
router.post('/addReport', reportController.createReport);
router.post('/addManyReports', reportController.createManyReport);
router.put('/updateReport', reportController.updateReport);
router.delete('/deleteReport/:id', reportController.deletereport);

module.exports = router;
