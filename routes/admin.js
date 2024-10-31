const express = require('express');
const accountController = require('../controllers/admin/AccountContoller');
const jobSeekerController = require('../controllers/admin/JobSeekerController');
const companyController = require('../controllers/admin/CompanyController');
const jobController = require('../controllers/admin/JobController');
const jobApplicationController = require('../controllers/admin/JobApplicationController');

const router = express.Router();

router.get('/', (req, res) => {
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


router.post('/account', accountController.createUpdateAccount);
router.get('/account', accountController.getAllAccounts);
router.get('/account/:id', accountController.getAccountById);
// router.put('/account/:id', accountController.updateAccount);
router.post('/account/delete/:id', accountController.deleteAccount);


router.post('/jobseeker', jobSeekerController.createUpdateJobSeeker);
router.get('/jobseeker', jobSeekerController.getAllJobSeekers);
router.get('/jobseeker/:id', jobSeekerController.getJobSeekerById);
router.post('/jobseeker/delete/:id', jobSeekerController.deleteJobSeeker);

router.post('/company', companyController.createUpdateCompany);
router.get('/company', companyController.getAllCompanies);
router.get('/company/:id', companyController.getCompanyById);
router.post('/company/delete/:id', companyController.deleteCompany);


router.post('/job', jobController.createUpdateJob);
router.get('/job', jobController.getAllJobs);
router.get('/job/:id', jobController.getJobById);
router.post('/job/delete/:id', jobController.deleteJob);


router.post('/jobapplication', jobApplicationController.createUpdateJobApplication);
router.get('/jobapplication', jobApplicationController.getAllJobApplications);
router.get('/jobapplication/:id', jobApplicationController.getJobApplicationById);
router.post('/jobapplication/delete/:id', jobApplicationController.deleteJobApplication);


module.exports = router;

// router.get('/', accountController.loginView);
// router.get('/register', authController.registerView);
// router.get('/login', authController.loginView);
// router.get('/logout', authController.logoutUser);
// router.post('/register', authController.registerUser);
// router.post('/login', authController.loginUser);
// router.get('/test', authController.test);

