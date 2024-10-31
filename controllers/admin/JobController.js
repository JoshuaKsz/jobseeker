const Job = require('../../models/JobModel'); // Adjust the path as needed
const Company = require('../../models/CompanyModel'); // For companyId reference

module.exports = {
  createUpdateJob: async (req, res) => {
    const { jobId, companyId, jobTitle, requirements, benefits, salary, dateOpened, dateExpired, industry } = req.body;

    try {
      const existingCompany = await Company.findOne({ where: { companyId } });
      if (!existingCompany) {
        return res.status(400).send('Company does not exist');
      }

      const existingJob = await Job.findOne({ where: { jobId } });
      if (existingJob) {
        console.log("edit/update");

        if (jobTitle) existingJob.jobTitle = jobTitle;
        if (requirements) existingJob.requirements = requirements;
        if (benefits) existingJob.benefits = benefits;
        if (salary) existingJob.salary = salary;
        if (dateOpened) existingJob.dateOpened = dateOpened;
        if (dateExpired) existingJob.dateExpired = dateExpired;
        if (industry) existingJob.industry = industry;

        await existingJob.save();
      } else {
        console.log("create?");
        await Job.create({ companyId, jobTitle, requirements, benefits, salary, dateOpened, dateExpired, industry });
      }

      res.redirect('/admin/job');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAllJobs: async (req, res) => {
    try {
      const jobs = await Job.findAll();
      res.render("admin/job", { jobs });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getJobById: async (req, res) => {
    const { id } = req.params;

    try {
      const job = await Job.findOne({ where: { jobId: id } });
      if (!job) {
        return res.status(404).send('Job not found');
      }
      res.status(200).json(job);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  deleteJob: async (req, res) => {
    const { id } = req.params;

    try {
      const job = await Job.findOne({ where: { jobId: id } });
      if (!job) {
        return res.status(404).send('Job not found');
      }
      await job.destroy();
      res.redirect('/admin/job');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },
};
