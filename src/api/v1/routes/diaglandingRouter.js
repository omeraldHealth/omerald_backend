const express = require('express');
const router = express.Router();
const diagLandingController = require("../controllers/category");

router.get('/getAllCategories', diagLandingController.getAllCategories);
router.post('/createCategories', diagLandingController.createCategory);
router.put('/updateCategories/:id', diagLandingController.updateCategory);
router.delete('/deleteCategories/:id', diagLandingController.deleteCategory);

module.exports = router;
