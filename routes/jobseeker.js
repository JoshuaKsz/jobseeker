const express = require('express');
const router = express.Router();
// const AuthController = require('./controllers/AuthController');
const authMiddleware = require('../middleware/auth'); 
const jobseekerController = require('../controllers/admin/JobSeekerController');
const JobController = require('../controllers/admin/JobController');
const companyController = require('../controllers/admin/CompanyController');
// Route untuk melihat daftar lowongan
router.get('/jobs', JobController.listJobs);
router.get('/jobseeker/company/:companyId', companyController.getCompanyProfile);

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
