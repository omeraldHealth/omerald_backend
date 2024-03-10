const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category");

router.get('/getAllCategories', categoryController.getAllCategories);
router.post('/createCategories', categoryController.createCategory);
router.put('/updateCategories/:id', categoryController.updateCategory);
router.delete('/deleteCategories/:id', categoryController.deleteCategory);

module.exports = router;
