const express = require('express');
const router = express.Router();
const parameterController = require("../controllers/parameter")

// GET all users
router.get('/getAllParams', parameterController.getParameter);
router.post('/addParam', parameterController.createParameter);
router.post('/addManyParams', parameterController.createManyParameter);
router.put('/updateParam', parameterController.updateParameter);
router.delete('/deleteParam/:id', parameterController.deleteparameter);
router.get('/searchParam/:query', parameterController.searchParameter);

module.exports = router;
