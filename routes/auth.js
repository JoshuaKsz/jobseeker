const express = require('express');
const authController = require('../controllers/AuthController');
const dashboardController = require('../controllers/DashboardController');
const accountController = require('../controllers/admin/AccountContoller');
const router = express.Router();


// Route untuk menampilkan halaman login
router.get('/', authController.loginView);

// Route untuk proses login
router.post('/', authController.loginUser);
router.get('/', authController.registerView);
router.post('/', authController.registerUser);
// router.get('/', authController.loginView);
router.get('/register', authController.registerView);
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/test', authController.test);
router.post('/login/forgotPassword', accountController.forgotPassword);
router.get('/login/forgotPassword', accountController.forgotPassword);
module.exports = router;
 