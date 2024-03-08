const express = require('express');
const router = express.Router();
const parameterController = require("../controllers/parameter")
const multer = require('multer');

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// GET all users
router.get('/getAllParams', parameterController.getParameter);
router.post('/addParam', parameterController.createParameter);
router.post('/addManyParams',upload.single('file'), parameterController.createManyParameters);
router.put('/updateParam', parameterController.updateParameter);
router.delete('/deleteParam/:id', parameterController.deleteparameter);
router.get('/searchParam/:query', parameterController.searchParameter);

module.exports = router;
