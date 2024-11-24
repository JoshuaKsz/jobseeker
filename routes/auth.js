const express = require('express');
const authController = require('../controllers/AuthController');
const dashboardController = require('../controllers/DashboardController');

const router = express.Router();



router.get('/', authController.loginView);
router.get('/register', authController.registerView);
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/test', authController.test);

module.exports = router;
