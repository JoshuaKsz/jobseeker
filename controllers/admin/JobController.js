const Job = require('../../models/JobModel'); // Adjust the path as needed
const Company = require('../../models/CompanyModel'); // For companyId reference
const Account = require('../../models/AccountModel'); 
const { Op } = require('sequelize');
module.exports = {
  

  createUpdateJob: async (req, res) => {
    const { jobId, jobTitle, requirements, benefits, salary, dateOpened, dateExpired, industry } = req.body;
    const userId = req.session.userId;
  
    if (!userId) {
      req.flash('error', 'User not logged in');
      return res.redirect('/login');
    }
    try {
      const existingCompany = await Company.findOne({ where: { userId } });
      if (!existingCompany) {
        req.flash('error', 'Company do not exist');
        return res.redirect('/dashboard');
      }
      const companyId = existingCompany.companyId;

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
        req.flash('success', 'Job updated successfully!');
      } else {
        console.log("create?");
        await Job.create({  companyId,jobTitle, requirements, benefits, salary, dateOpened, dateExpired, industry });
        req.flash('success', 'Job created successfully!');
      }

      res.redirect('/admin/job');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to create/update Job. Please try again later.');
      res.redirect('/admin/job');
    }
  },

  getAllJobs: async (req, res) => {
    try {
      const userId = req.session.userId;
    if (!userId) {
      return res.status(403).send('Access denied');
    }
    
    // Cari company berdasarkan userId
    const companyUser = await Company.findOne({ where: { userId } }); 
    
    if (!companyUser) {
      // Jika company tidak ditemukan, kirim pesan error
      return res.render("admin/job", {
          jobs: [],
          checkUser: req.session.email,
          companyId: null,
          jobTitle: null,
          requirements: null,
          benefits: null,
          salary: null,
          dateOpened: null,
          dateExpired: null,
          industry: null,
          error: 'You must create your profile company first' // Tambahkan pesan error di sini
      });
  }

    const jobs = await Job.findAll({ where: { companyId: companyUser.companyId } });
      
    res.render("admin/job", { jobs, checkUser: req.session.email,companyId: companyUser.companyId,jobTitle: companyUser.jobTitle, requirements: companyUser.requirements, benefits: companyUser.benefits, salary: companyUser.salary, dateOpened: companyUser.dateOpened, dateExpired: companyUser.dateExpired, industry: companyUser.industry });
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
        req.flash('error', 'Job not found!');
        return res.redirect('/admin/job');
      }
      await job.destroy();
      req.flash('success', 'Job deleted successfully!');
      res.redirect('/admin/job');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to delete Job. Please try again later.');
      res.redirect('/admin/job');
    }
  },

  listJobs: async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: {
                model: Company,
                attributes: ['companyId', 'companyName', 'city', 'country'], 
            },
        });

        const currentDate = new Date();
        const jobsWithStatus = jobs.map(job => {
            const isExpired = job.dateExpired && new Date(job.dateExpired) < currentDate;
            return {
                ...job.dataValues,
                status: isExpired ? 'expired' : 'active',
                companyId: job.Company.companyId, // Add companyId
                companyName: job.Company.companyName,
                city: job.Company.city,
                country: job.Company.country,
            };
        });

        res.render('jobseeker/jobs', { jobs: jobsWithStatus });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
},

getJobsPage: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // 9 jobs per page
    const offset = (page - 1) * limit;

    const currentDate = new Date();

    // Get total count and jobs with pagination
    const { count, rows: jobs } = await Job.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.or]: [
          { dateExpired: { [Op.gte]: currentDate } }, // Belum expired
          { dateExpired: null }, // Tidak memiliki tanggal expired
        ],
      },
      include: {
        model: Company,
        attributes: ['companyId', 'companyName', 'city', 'country'],
      },
    });

    const jobsWithStatus = jobs.map(job => ({
      ...job.dataValues,
      status: 'active',
      companyId: job.Company.companyId,
      companyName: job.Company.companyName,
      city: job.Company.city,
      country: job.Company.country,
    }));

    // Calculate pagination data
    const totalPages = Math.ceil(count / limit);

    // Render with pagination data
    res.render('jobseeker/jobs', {
      jobs: jobsWithStatus,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: totalPages,
    });

  } catch (err) {
    console.error(err);
    res.render('jobseeker/jobs', {
      jobs: [],
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
      lastPage: 0,
      error: 'Terjadi kesalahan saat memuat data lowongan. Silakan coba lagi nanti.',
    });
  }
},

getSearchJob: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // 9 jobs per page
    const offset = (page - 1) * limit;

    const currentDate = new Date();

    // Get total count and jobs with pagination
    const { count, rows: jobs } = await Job.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.or]: [
          { dateExpired: { [Op.gte]: currentDate } }, // Belum expired
          { dateExpired: null }, // Tidak memiliki tanggal expired
        ],
      },
      include: {
        model: Company,
        attributes: ['companyId', 'companyName', 'city', 'country'],
      },
    });

    const jobsWithStatus = jobs.map(job => ({
      ...job.dataValues,
      status: 'active',
      companyId: job.Company.companyId,
      companyName: job.Company.companyName,
      city: job.Company.city,
      country: job.Company.country,
    }));

    // Calculate pagination data
    const totalPages = Math.ceil(count / limit);

    res.render("job/search", { items: jobsWithStatus, page: 1, totalPages: 0, searchTerm: '' });

    // res.render('jobseeker/jobs', {
    //   jobs: jobsWithStatus,
    //   currentPage: page,
    //   totalPages,
    //   hasNextPage: page < totalPages,
    //   hasPrevPage: page > 1,
    //   nextPage: page + 1,
    //   prevPage: page - 1,
    //   lastPage: totalPages,
    // });

  } catch (err) {
    console.error(err);
    res.render('jobseeker/jobs', {
      items: [],
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
      lastPage: 0,
      error: 'Terjadi kesalahan saat memuat data lowongan. Silakan coba lagi nanti.',
    });
  }
  // console.log("dasads", items);
  // console.log(`Incoming request: ${req.method} ${req.url}`);
  // console.log("getSearchJob");
  // res.render("job/search", { items: jobsWithStatus, page: 1, totalPages: 0, searchTerm: '' });
},

getSearchJobString: async (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  const { page, id } = req.params;
  console.log(`Parameters: ${JSON.stringify(req.params)}`);
  console.log(`Page: ${page}, Search Term: ${id}`);

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const items = await Job.findAll({
      where: {
        [Op.or]: [
          {
            jobTitle: {
              [Op.like]: `%${id}%`, // Op.like partial matching
            },
          },
          {
            requirements: {
              [Op.like]: `%${id}%`, // Partial match for requirements
            },
          },
        ],
      },
      limit: limit,
      offset: offset,
    });
    console.log("Retrieved Items:", items);

    const totalItems = await Job.count({
      where: {
        [Op.or]: [
          {
            jobTitle: {
              [Op.like]: `%${id}%`, // Op.like partial matching
            },
          },
          {
            requirements: {
              [Op.like]: `%${id}%`, // Partial match for requirements
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(totalItems / limit);
    res.render('job/search', { items, page: parseInt(page), totalPages, searchTerm: id });
  } catch (error) {
    console.error("Error fetching job seekers:", error);
    res.status(500).send('Internal Server Error');
  }
}


};
