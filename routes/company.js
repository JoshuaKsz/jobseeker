const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// const AuthController = require('./controllers/AuthController');
const authMiddleware = require('../middleware/auth'); 
const jobseekerController = require('../controllers/admin/JobSeekerController');
const jobController = require('../controllers/admin/JobController');
const companyController = require('../controllers/admin/CompanyController');
const jobApplicationForm = require('../controllers/jobseeker/JobSeekerFormApplicationController');

router.get("/profile/:companyId", companyController.comapnyProfileView);

router.get('/search/:page/:id', companyController.getSearchCompanyString);

router.get('/search/:page', companyController.getSearchCompany);


router.get('/jobApplication/history', authMiddleware, jobApplicationForm.getHistoryPageCompany);
router.post('/jobApplication/history', authMiddleware, jobApplicationForm.getHistoryPageCompany);


router.post('/approve/:applicationId', authMiddleware, companyController.approveApplication); // Tambahkan authMiddleware jika perlu
router.post('/reject/:applicationId', authMiddleware, companyController.rejectApplication); // Tambahkan authMiddleware jika perlu


module.exports = router;
