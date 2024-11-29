const express = require('express');
const accountController = require('../controllers/admin/AccountContoller');
const jobSeekerController = require('../controllers/admin/JobSeekerController');
const companyController = require('../controllers/admin/CompanyController');
const jobController = require('../controllers/admin/JobController');
const jobApplicationController = require('../controllers/admin/JobApplicationController');
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth'); 

const router = express.Router();

router.get('/',authMiddleware, (req, res) => {
    res.send(`
        <h1>Admin Dashboard</h1>
        <ul>
            <li><a href="/admin/account">Accounts</a></li>
            <li><a href="/admin/jobseeker">Job Seekers</a></li>
            <li><a href="/admin/company">Companies</a></li>
            <li><a href="/admin/job">Jobs</a></li>
            <li><a href="/admin/jobapplication">Job Applications</a></li>
        </ul>
    `);
});


router.post('/account',authMiddleware, accountController.createUpdateAccount);
router.get('/account',authMiddleware, accountController.getAllAccounts);
router.get('/account/:id',authMiddleware, accountController.getAccountById);
// router.put('/account/:id', accountController.updateAccount);
router.post('/account/delete/:id',authMiddleware, accountController.deleteAccount);


router.post('/jobseeker',authMiddleware, jobSeekerController.createUpdateJobSeeker);
router.get('/jobseeker',authMiddleware, jobSeekerController.getAllJobSeekers);
router.get('/jobseeker/:id',authMiddleware, jobSeekerController.getJobSeekerById);
router.post('/jobseeker/delete/:id',authMiddleware, jobSeekerController.deleteJobSeeker);

router.post('/company',authMiddleware, companyController.createUpdateCompany);
router.get('/company',authMiddleware, companyController.getAllCompanies);
router.get('/company/:id',authMiddleware, companyController.getCompanyById);
router.post('/company/delete/:id',authMiddleware, companyController.deleteCompany);


router.post('/job',authMiddleware, jobController.createUpdateJob);
router.get('/job',authMiddleware, jobController.getAllJobs);
router.get('/job/:id', authMiddleware,jobController.getJobById);
router.post('/job/delete/:id',authMiddleware, jobController.deleteJob);


router.post('/jobapplication',authMiddleware, jobApplicationController.createUpdateJobApplication);
router.get('/jobapplication',authMiddleware, jobApplicationController.getAllJobApplications);
router.get('/jobapplication/:id',authMiddleware, jobApplicationController.getJobApplicationById);
router.post('/jobapplication/delete/:id',authMiddleware, jobApplicationController.deleteJobApplication);
router.get('/jobapplication/form', (req, res) => {
    const { jobId, jobSeekerId } = req.query;
    res.render('admin/jobApplication', {
      jobId: jobId || '',
      jobSeekerId: jobSeekerId || '',
      checkUser: req.session.email,
    });
  });

module.exports = router;

// router.get('/', accountController.loginView);
// router.get('/register', authController.registerView);
// router.get('/login', authController.loginView);
// router.get('/logout', authController.logoutUser);
// router.post('/register', authController.registerUser);
// router.post('/login', authController.loginUser);
// router.get('/test', authController.test);

