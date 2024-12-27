const JobApplication = require('../../models/JobApplicationModel');
const JobSeeker = require('../../models/JobSeekerModel');
const Job = require('../../models/JobModel');

const multer = require('multer');
const Company = require('../../models/CompanyModel');

module.exports = {
  getFormJob: async (req, res) => {
    const { jobId } = req.params;
    const jobs = await Job.findOne({ where: { jobId:jobId } });
    // res.send(req.session);
    const existingJobSeeker = await JobSeeker.findOne({ where: { userId: req.session.userId } });

    res.render('jobseeker/jobApplication', { jobId, id: existingJobSeeker.jobSeekerId, jobs});
  },
  submitFormJob: async (req, res) => {
    const { jobId } = req.params;
    const otherId = req.session.otherId;
    const applicationStatus = 'Pending';

    

    // console.log(otherId, jobId, applicationStatus, fileName)
    const newApplication = await JobApplication.create({ jobSeekerId: otherId, jobId, applicationStatus, File: '' });

    // handle file uploads
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        // saved lokasi
        cb(null, 'test/'); 
      },
      filename: (req, file, cb) => {
        // Set unique file name
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, newApplication.applicationId + '-' + otherId + '-' + jobId + '-' + file.originalname ); // Keep file extension
      }
    });

    const upload = multer({ storage: storage }).array('files');

    upload(req, res, async (err) => {
      if (err) {
        return next(err); // Handle any errors from Multer
      }
      const files = req.files; // Multer middleware will parse files
      // console.log(files);
      const fileName = files.map(file => file.originalname).join(',');

      if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded.");
      }

      if (newApplication) {
        console.log("edit/update");

        if (applicationStatus) newApplication.applicationStatus = applicationStatus;
        if (File) newApplication.File = fileName;
        // if (applyDate) newApplication.applyDate = applyDate;

        await newApplication.save();
      }
      res.redirect('/jobApplication/history');
    });
    // res.send((req.params, req.body, req.session, req));
  },


  getHistoryPage: async (req, res) => {
    const existingJobSeeker = await JobSeeker.findOne({ where: { userId: req.session.userId } });
    const applications = await JobApplication.findAll({ where: { jobSeekerId: existingJobSeeker.jobSeekerId } })
    console.log(applications);

    res.render('jobseeker/jobApplicationHistory', { applications })
  },

  getHistoryPageCompany: async (req, res) => {
    const existingCompany = await Company.findOne({ where: { userId: req.session.userId } });
    console.log(existingCompany);
    const jobss = await Job.findAll({ where: { companyId: existingCompany.companyId }});
    console.log(jobss);
    const applicationss = await Promise.all(jobss.map(async (job) => {
      const applications = await JobApplication.findAll({ where: { jobId: job.jobId } });
      console.log(applications);
      // applications.job.jobTitle = ;
      return applications; // Return a 2D array with job and its applications
    }));
  
    console.log(applicationss);

    res.render('company/jobApplicationHistory', { applicationss })
  },


  



  createUpdateJobApplication: async (req, res) => {
    const { applicationId, jobId,applicationStatus, File, applyDate } = req.body;
    // const jobId = req.params.jobId;
    const jobSeekerId = req.session.userId;
    try {
      const existingJobSeeker = await JobSeeker.findOne({ where: { jobSeekerId } });
      const existingJob = await Job.findOne({ where: { jobId } });

      if (!existingJobSeeker) {
        return res.status(400).send('Job Seeker does not exist');
      }
      if (!existingJob) {
        return res.status(400).send('Job does not exist');
      }

      const existingApplication = await JobApplication.findOne({ where: { applicationId } });
      if (existingApplication) {
        console.log("edit/update");

        if (applicationStatus) existingApplication.applicationStatus = applicationStatus;
        if (File) existingApplication.File = File;
        if (applyDate) existingApplication.applyDate = applyDate;

        await existingApplication.save();
      } else {
        console.log("create?");
        await JobApplication.create({ jobSeekerId, jobId, applicationStatus, File, applyDate });
      }

      res.redirect('/admin/jobapplication');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAllJobApplications: async (req, res) => {
    try {
      const applications = await JobApplication.findAll();
      res.render("admin/jobApplication", { applications, checkUser: req.session.email });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getJobApplicationById: async (req, res) => {
    const { id } = req.params;

    try {
      const application = await JobApplication.findOne({ where: { applicationId: id } });
      if (!application) {
        return res.status(404).send('Application not found');
      }
      res.status(200).json(application);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  deleteJobApplication: async (req, res) => {
    const { id } = req.params;

    try {
      const application = await JobApplication.findOne({ where: { applicationId: id } });
      if (!application) {
        return res.status(404).send('Application not found');
      }
      await application.destroy();
      res.redirect('/admin/jobapplication');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },
};
