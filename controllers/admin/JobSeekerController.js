const JobSeeker = require('../../models/JobSeekerModel'); // Adjust the path as needed
const Account = require('../../models/AccountModel'); // For userId reference

module.exports = {
 
  createUpdateJobSeeker: async (req, res) => {
    const { jobSeekerId, jobSeekerName, phone, city, country, about_skill, education, experience, socialMedia } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(400).send('User not logged in');
    }

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
      console.error("Error during job seeker creation/update:",err);
      console.log('Received data:', req.body); // Menampilkan data yang diterima dari form
      return res.status(500).send('Server error');
    }
  },

  getAllJobSeekers: async (req, res) => {
    try {
      const userId = req.session.userId; // Ambil userId dari sesi pengguna yang login
      if (!userId) {
        return res.status(403).send('Access denied'); // Pastikan user login
      }
  
      const user = await Account.findOne({ where: { userId } }); // Hanya ambil data user yang sesuai dengan sesi login
      if (!user) {
        return res.status(404).send('User not found');
      }
      const jobSeekers = await JobSeeker.findAll({ where: { userId }});
    
      res.render("admin/jobSeeker", { jobSeekers, checkUser: req.session.email, userId: user.userId, role:user.role });
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
