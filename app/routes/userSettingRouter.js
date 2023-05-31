const express = require('express');
const router = express.Router();
const userSettingController = require("../controllers/userSettings")

// GET all users
router.get('/getUserSetting', userSettingController.getUserSetting);
router.get('/getUserSettingByKey/:key', userSettingController.getUserSettingByKey);
router.post('/addUserSetting', userSettingController.createUserSetting);
router.put('/updateUserSetting', userSettingController.updateUserSetting);

module.exports = router;
