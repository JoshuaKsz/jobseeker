const express = require('express');
const router = express.Router();
// const AuthController = require('./controllers/AuthController');
const authMiddleware = require('../middleware/auth'); 
const jobseekerController = require('../controllers/admin/JobSeekerController');
const JobController = require('../controllers/admin/JobController');

// Route untuk melihat daftar lowongan
router.get('/jobs', JobController.listJobs);


// Halaman Dashboard untuk Jobseeker
router.get('/jobseeker', (req, res) => {
  // Cek apakah pengguna sudah login dan memiliki role 'Jobseeker'
  if (req.session && req.session.role === 'Jobseeker') {
    return res.render('jobseeker/dashboard'); // Menampilkan halaman dashboard jobseeker.pug
  } else {
    return res.redirect('/login'); // Jika tidak, redirect ke halaman login
  }
});

module.exports = router;
