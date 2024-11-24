const express = require('express');
const authMiddleware = require('../middleware/auth');
const dashboardController = require('../controllers/DashboardController');

const router = express.Router();
router.get('/somethingDisplay', dashboardController.dashboardView);

module.exports = router;
