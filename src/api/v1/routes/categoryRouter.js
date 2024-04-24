const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/diagnosticLanding");

router.get('/getDiagLanding', categoryController.getAllCategories);
router.post('/createDiagLanding', categoryController.createCategory);
router.put('/updateDiagLanding/:id', categoryController.updateCategory);
router.delete('/deleteDiagLanding/:id', categoryController.deleteCategory);

module.exports = router;
