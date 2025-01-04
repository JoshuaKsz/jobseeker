const JobApplication = require('../../models/JobApplicationModel');
const JobSeeker = require('../../models/JobSeekerModel');
const Job = require('../../models/JobModel');

const multer = require('multer');
const Company = require('../../models/CompanyModel');
const fs = require('fs');
const path = require('path');
const Account = require('../../models/AccountModel');

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

    try {
      // Dapatkan waktu saat ini
      const applyDate = new Date(); // Ini akan menghasilkan objek Date dengan waktu saat ini

      const newApplication = await JobApplication.create({
        jobSeekerId: otherId,
        jobId,
        applicationStatus,
        File: '',
        applyDate // Tambahkan applyDate ke sini
      });

      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'test/');
        },
        filename: (req, file, cb) => {
          cb(null, newApplication.applicationId + '-' + otherId + '-' + jobId + '-' + file.originalname);
        }
      });

      const upload = multer({ storage: storage }).array('files');

      upload(req, res, async (err) => {
        if (err) {
          console.error("Error uploading files:", err);
          return res.status(500).json({ success: false, message: 'File upload failed.' });
        }

        const files = req.files;
        if (!files || files.length === 0) {
          // Hapus job application yang sudah dibuat jika tidak ada file yang diupload
          await JobApplication.destroy({ where: { applicationId: newApplication.applicationId } });
          return res.status(400).json({ success: false, message: 'No files uploaded.' });
        }

        const fileNames = files.map(file => file.filename);
        const filePaths = fileNames.map(filename => path.join('test', filename));

        try {
          // Update data aplikasi
          if (newApplication) {
            newApplication.applicationStatus = applicationStatus;
            newApplication.File = filePaths.join(',');
            // Tidak perlu update applyDate di sini karena sudah di-set saat create
            await newApplication.save();
            return res.status(200).json({ success: true, message: 'Application submitted successfully!' });
          } else {
            return res.status(400).json({ success: false, message: 'Failed to create application.' });
          }
        } catch (updateErr) {
          console.error("Error updating application:", updateErr);
          return res.status(500).json({ success: false, message: 'Failed to update application.' });
        }
      });
    } catch (err) {
      console.error("Error creating application:", err);
      return res.status(500).json({ success: false, message: 'Failed to create application.' });
    }
  },
  // ;

  getHistoryPage: async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const existingJobSeeker = await JobSeeker.findOne({ where: { userId: req.session.userId } });
        if (!existingJobSeeker) {
            return res.status(404).send('Job Seeker profile not found.');
        }

        const applications = await JobApplication.findAll({
            where: { jobSeekerId: existingJobSeeker.jobSeekerId },
            include: [
                {
                    model: Job,
                    include: [
                        {
                            model: Company,
                            attributes: ['companyName', 'city', 'country'] // Sertakan atribut yang Anda inginkan dari Company
                        }
                    ]
                }
            ],
            order: [['applyDate', 'DESC']] // Urutkan berdasarkan applyDate secara descending
        });

        res.render('jobseeker/jobApplicationHistory', { applications });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
},

getHistoryPageCompany: async (req, res) => {
  try {
    const existingCompany = await Company.findOne({ where: { userId: req.session.userId } });
    if (!existingCompany) {
      req.flash('error', 'Company profile not found.');
      return res.redirect('/dashboard'); // Redirect ke halaman dashboard atau halaman lain yang sesuai
    }

    const jobs = await Job.findAll({
      where: { companyId: existingCompany.companyId },
      include: [
        {
          model: JobApplication,
          include: [
            {
              model: JobSeeker,
              include: [
                {
                  model: Account,
                  // attributes: ['jobSeekerId', 'jobSeekerName'], // Sertakan atribut yang ingin ditampilkan dari JobSeeker
                },
              ],
              // attributes: ['jobSeekerId', 'jobSeekerName'], // Sertakan atribut yang ingin ditampilkan dari JobSeeker
            },
          ],
        },
      ],
    });

    res.render('company/jobApplicationHistory', { jobs });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load job application history.');
    return res.redirect('/dashboard'); // Redirect ke halaman dashboard atau halaman lain yang sesuai
  }
},

  



  createUpdateJobApplication: async (req, res) => {
    const { applicationId, jobId,applicationStatus, File, applyDate } = req.body;
    // const jobId = req.params.jobId;
    const jobSeekerId = req.session.userId;
    try {
      const existingJobSeeker = await JobSeeker.findOne({ where: { jobSeekerId } });
      const existingJob = await Job.findOne({ where: { jobId } });

      if (!existingJobSeeker) {
        req.flash('error', 'Job Seeker does not exist.');
        res.redirect(`/jobseeker/jobs`);
      }
      if (!existingJob) {
        req.flash('error', 'Job does not exist.');
        res.redirect(`/jobseeker/jobs`);
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
