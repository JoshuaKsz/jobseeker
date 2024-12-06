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


// handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // saved lokasi
      cb(null, 'test/'); 
    },
    filename: (req, file, cb) => {
      // Set unique file name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Keep file extension
    }
});
  
const upload = multer({ storage: storage });
  

// Route untuk melihat daftar lowongan
router.get('/jobs', jobController.listJobs);
// ini salah!
router.get('/jobseeker/company/:companyId', authMiddleware, companyController.getCompanyProfile); // Sepertinya ini salah!

router.get('/jobsApply/:jobId', authMiddleware, jobApplicationForm.getFormJob);
router.post('/jobsApply/:jobId', upload.array('files'), authMiddleware, jobApplicationForm.submitFormJob);


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
