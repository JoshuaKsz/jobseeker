const JobSeeker = require('../../models/JobSeekerModel'); // Adjust the path as needed
const Account = require('../../models/AccountModel'); // For userId reference

module.exports = {
  createUpdateJobSeeker: async (req, res) => {
    const { jobSeekerId, userId, jobSeekerName, phone, city, country, about_skill, education, experience, socialMedia } = req.body;
    
    try {
      const existingAccount = await Account.findOne({ where: { userId } });
      if (!existingAccount) {
        return res.status(400).send('User does not exist');
      }

      const existingJobSeeker = await JobSeeker.findOne({ where: { jobSeekerId } });
      if (existingJobSeeker) {
        console.log("edit/update");

        if (jobSeekerName) existingJobSeeker.jobSeekerName = jobSeekerName;
        if (phone) existingJobSeeker.phone = phone;
        if (city) existingJobSeeker.city = city;
        if (country) existingJobSeeker.country = country;
        if (about_skill) existingJobSeeker.about_skill = about_skill;
        if (education) existingJobSeeker.education = education;
        if (experience) existingJobSeeker.experience = experience;
        if (socialMedia) existingJobSeeker.socialMedia = socialMedia;

        await existingJobSeeker.save();
      } else {
        console.log("create?");
        await JobSeeker.create({ userId, jobSeekerName, phone, city, country, about_skill, education, experience, socialMedia });
      }

      res.redirect('/admin/jobseeker');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAllJobSeekers: async (req, res) => {
    try {
      const jobSeekers = await JobSeeker.findAll();
      res.render("admin/jobSeeker", { jobSeekers });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getJobSeekerById: async (req, res) => {
    const { id } = req.params;

    try {
      const jobSeeker = await JobSeeker.findOne({ where: { jobSeekerId: id } });
      if (!jobSeeker) {
        return res.status(404).send('Job seeker not found');
      }
      res.status(200).json(jobSeeker);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  deleteJobSeeker: async (req, res) => {
    const { id } = req.params;
    
    try {
      const jobSeeker = await JobSeeker.findOne({ where: { jobSeekerId: id } });
      if (!jobSeeker) {
        return res.status(404).send('Job seeker not found');
      }
      await jobSeeker.destroy();
      res.redirect('/admin/jobseeker');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },
};
