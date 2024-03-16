const express = require('express');
const router = express.Router();
const activityController = require("../controllers/userActivity")

router.get('/activities', activityController.getActivity);
router.get('/activity/:id', activityController.getActivityById);
router.post('/createActivity', activityController.createActivity);
router.put('/updateActivities', activityController.updateActivity);
router.delete('/activities/:id', activityController.deleteActivity);

module.exports = router;
