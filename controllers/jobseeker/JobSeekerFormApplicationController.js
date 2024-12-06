const JobApplication = require('../../models/JobApplicationModel'); // Adjust the path as needed
const JobSeeker = require('../../models/JobSeekerModel'); // For jobSeekerId reference
const Job = require('../../models/JobModel'); // For jobId reference

module.exports = {
  getFormJob: async (req, res) => {
    const { jobId } = req.params;

    // res.send(req.session);
    const existingJobSeeker = await JobSeeker.findOne({ where: { userId: req.session.userId } });

    res.render('jobseeker/jobApplication', { jobId, id: existingJobSeeker.jobSeekerId});
  },
  submitFormJob: async (req, res) => {
    const { jobId } = req.params;
    const files = req.files; // Multer middleware will parse files
    const otherId = req.session.otherId;

    console.log(files);

    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    res.send("SUCCESS");
    // res.send((req.params, req.body, req.session, req));
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
