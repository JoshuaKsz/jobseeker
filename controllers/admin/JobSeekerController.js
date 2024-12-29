const JobSeeker = require('../../models/JobSeekerModel'); // Adjust the path as needed
const Account = require('../../models/AccountModel'); // For userId reference
const { Op } = require('sequelize');

module.exports = {
 
  createUpdateJobSeeker: async (req, res) => {
    const { jobSeekerId, jobSeekerName, phone, city, country, about_skill, education, experience, socialMedia } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      req.flash('error', 'User not logged in');
      return res.redirect('/login');
    }

    try {
      const existingAccount = await Account.findOne({ where: { userId } });
      if (!existingAccount) {
        req.flash('error', 'User does not exist');
        return res.redirect('/login');
      }

      const existingJobSeeker = await JobSeeker.findOne({ where: { userId: existingAccount.userId } });
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
        req.flash('success', 'Profile updated successfully!');
      } else {
        console.log("create?");
        await JobSeeker.create({ userId, jobSeekerName, phone, city, country, about_skill, education, experience, socialMedia });
        req.flash('success', 'Profile created successfully!');
      }

      res.redirect('/admin/jobseeker');
    } catch (err) {
      console.error("Error during job seeker creation/update:",err);
      console.log('Received data:', req.body); // Menampilkan data yang diterima dari form
      req.flash('error', 'Failed to create/update Profile. Please try again later.');
      res.redirect('/admin/jobseeker');
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
        req.flash('error', 'Job Seeker not found!');
        return res.redirect('/admin/jobseeker');
      }
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
        req.flash('error', 'Job Seeker not found!');
        return res.redirect('/admin/jobseeker');
      }
      await jobSeeker.destroy();
      req.flash('success', 'Profile deleted successfully!');
      res.redirect('/admin/jobseeker');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to delete Profile. Please try again later.');
      res.redirect('/admin/jobseeker');
    }
  },

  profileViewer: async (req, res) => {
    const { id } = req.params;

    try {
      const jobSeeker = await JobSeeker.findOne({ where: { jobSeekerId: id } });
      if (!jobSeeker) {
        return res.status(404).send('Job seeker not found');
      }
      res.render("jobseeker/jobSeekerProfile", { jobSeeker: jobSeeker })
      
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getSearchJobSeeker: async (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("getSearchJobSeeker");
    res.render("jobseeker/search", { items: [], page: 1, totalPages: 0, searchTerm: '' });
  },

  getSearchJobSeekerString: async (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const { page, id } = req.params; // Assuming 'id' is the search term
    console.log(`Parameters: ${JSON.stringify(req.params)}`);
    console.log(`Page: ${page}, Search Term: ${id}`);

    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const items = await JobSeeker.findAll({
        where: {
          jobSeekerName: {
            [Op.like]: `%${id}%`, // Use Op.like for partial matching
          },
        },
        limit: limit,
        offset: offset,
      });
      console.log("Retrieved Items:", items);

      const totalItems = await JobSeeker.count({
        where: {
          jobSeekerName: {
            [Op.like]: `%${id}%`,
          },
        },
      });

      const totalPages = Math.ceil(totalItems / limit);
      res.render('jobseeker/search', { items, page: parseInt(page), totalPages, searchTerm: id });
    } catch (error) {
      console.error("Error fetching job seekers:", error);
      res.status(500).send('Internal Server Error');
    }
  }

};
