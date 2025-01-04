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

router.get("/profile/:id", jobseekerController.profileViewer);

// Route untuk melihat daftar lowongan
// router.get('/jobs', jobController.listJobs);
router.get('/jobs', jobController.getJobsPage);

router.get('/jobseeker/company/:companyId/:jobId', authMiddleware, companyController.getCompanyProfile); 

router.get('/jobsApply/:jobId', authMiddleware, jobApplicationForm.getFormJob);
router.post('/jobsApply/:jobId',  authMiddleware, jobApplicationForm.submitFormJob);
router.get('/jobApplication/history', authMiddleware, jobApplicationForm.getHistoryPage);

router.get('/search/:page/:id', jobseekerController.getSearchJobSeekerString);

router.get('/search/:page', jobseekerController.getSearchJobSeeker);


// Halaman Dashboard untuk Jobseeker
// router.get('/jobseeker', (req, res) => {
//   // Cek apakah pengguna sudah login dan memiliki role 'Jobseeker'
//   if (req.session && req.session.role === 'Jobseeker') {
//     return res.render('jobseeker/dashboard'); // Menampilkan halaman dashboard jobseeker.pug
//   } else {
//     return res.redirect('/login'); // Jika tidak, redirect ke halaman login
//   }
// });

module.exports = router;
