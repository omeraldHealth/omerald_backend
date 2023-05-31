const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getUsers);

// GET a user by phone number
router.get('/phone/:phoneNumber', userController.getUserByPhoneNumber);

// POST create a new user
router.post('/insertUser', userController.createUser);

// PUT update a user by ID
router.put('/updateUser', userController.updateUser);

// DELETE a user by ID
router.delete('/deleteUser', userController.deleteUser);

module.exports = router;
