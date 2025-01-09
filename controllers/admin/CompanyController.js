const Company = require('../../models/CompanyModel'); 
const Account = require('../../models/AccountModel'); 
const Job = require('../../models/JobModel');
const JobApplication = require('../../models/JobApplicationModel');
const { Op } = require('sequelize');
module.exports = {
  createUpdateCompany: async (req, res) => {
    const { companyName, industry, phone, city, country, email } = req.body;
    if (!req.session.userId) {
      req.flash('error', 'User not logged in');
      return res.redirect('/login');
    }
    try {
      const existingAccount = await Account.findOne({ where: { userId: req.session.userId } });
      if (!existingAccount) {
        req.flash('error', 'User does not exist');
        return res.redirect('/login');
      }

      const existingCompany = await Company.findOne({ where: { userId: req.session.userId } });
      if (existingCompany) {
        console.log("edit/update");

        if (companyName) existingCompany.companyName = companyName;
        if (industry) existingCompany.industry = industry;
        if (phone) existingCompany.phone = phone;
        if (city) existingCompany.city = city;
        if (country) existingCompany.country = country;
        if (email) existingCompany.email = email;

        await existingCompany.save();
        req.flash('success', 'Profile updated successfully!');
      } else {
        console.log("create?");
        await Company.create({ userId, companyName, industry, phone, city, country, email });
        req.flash('success', 'Profile created successfully!');
      }

      res.redirect('/admin/company');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to create/update Profile. Please try again later.');
      res.redirect('/admin/company');
    }
  },

  getAllCompanies: async (req, res) => {
    try {
      const userId = req.session.userId; // Ambil userId dari sesi pengguna yang login
      if (!userId) {
        return res.status(403).send('Access denied'); // Pastikan user login
      }
      const user = await Account.findOne({ where: { userId } }); // Hanya ambil data user yang sesuai dengan sesi login
      if (!user) {
        return res.status(404).send('User not found');
      }
      const companies = await Company.findAll({ where: { userId } });
      res.render("admin/company", { companies, checkUser: req.session.email,userId: user.userId,companyName:user.companyName, industry:user.industry, phone:user.phone, city:user.city, country:user.country, role:user.role });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getCompanyById: async (req, res) => {
    const { id } = req.params;

    try {
      const company = await Company.findOne({ where: { companyId: id } });
      if (!company) {
        return res.status(404).send('Company not found');
      }
      res.status(200).json(company);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  deleteCompany: async (req, res) => {
    const { id } = req.params;
    
    try {
      const company = await Company.findOne({ where: { companyId: id } });
      if (!company) {
        req.flash('error', 'Job Seeker not found!');
        return res.redirect('/admin/company');
      }
      await company.destroy();
      req.flash('success', 'Profile deleted successfully!');
      res.redirect('/admin/company');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to delete Profile. Please try again later.');
      res.redirect('/admin/company');
    }
  },

  getCompanyProfile: async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const jobId = req.params.jobId;
      const userId = req.session.userId;

      const company = await Company.findByPk(companyId);
      
      if (!company) {
          return res.status(404).send('Company not found');
      }
      
      const selectedJob= await Job.findOne({where: {jobId:jobId}})

      const currentDate = new Date();
      const jobs = await Job.findAll({
          where: {
              companyId: companyId,
              dateExpired: {
                  [Op.gt]: currentDate
              }
          }
      });

      res.render('jobseeker/companies', { 
          company, 
          jobs,
          checkUser: req.session.email,
          userId,
          selectedJob
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  comapnyProfileView: async (req, res) => {
    try {
      // const { companyId } = req.params;
  
      // const company = await Company.findOne({ where: { companyId: companyId } });
      // if (!company) {
      //   return res.status(404).send('Company not found');
      // }
      // res.render('company/companyViewer', { company: company})

      const { companyId } = req.params;
      const userId = req.session.userId;
      
      const company = await Company.findByPk(companyId);
      
      if (!company) {
          return res.status(404).send('Company not found');
      }

      const currentDate = new Date();
      const jobs = await Job.findAll({
          where: {
              companyId: companyId,
              dateExpired: {
                  [Op.gt]: currentDate
              }
          }
      });

      res.render('company/companyViewer', { 
          company, 
          jobs,
          checkUser: req.session.email,
          userId,
      });

    } catch (err) {
      console.error(err);
      res.status(500).send('error');
    }

  },
  
  getSearchCompany: async (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("getSearchCompany");
    res.render("company/search", { items: [], page: 1, totalPages: 0, searchTerm: '' });
  },

  getSearchCompanyString: async (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const { page, id } = req.params; // Assuming 'id' is the search term
    console.log(`Parameters: ${JSON.stringify(req.params)}`);
    console.log(`Page: ${page}, Search Term: ${id}`);

    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const items = await Company.findAll({
        where: {
          companyName: {
            [Op.like]: `%${id}%`, // Use Op.like for partial matching
          },
        },
        limit: limit,
        offset: offset,
      });
      console.log("Retrieved Items:", items);

      const totalItems = await Company.count({
        where: {
          companyName: {
            [Op.like]: `%${id}%`,
          },
        },
      });

      const totalPages = Math.ceil(totalItems / limit);
      res.render('company/search', { items, page: parseInt(page), totalPages, searchTerm: id });
    } catch (error) {
      console.error("Error fetching job seekers:", error);
      res.status(500).send('Internal Server Error');
    }
  },

  approveApplication: async (req, res) => {
    const { applicationId } = req.params;
    try {
      const application = await JobApplication.findByPk(applicationId);
      if (!application) {
        req.flash('error', 'Application not found.');
        return res.redirect('back');      // Ganti dengan route yang sesuai
      }
  
      // Pastikan yang mengubah adalah perusahaan yang memiliki lowongan
      const job = await Job.findByPk(application.jobId);
      const company = await Company.findOne({ where: { userId: req.session.userId } });
  
      if (job.companyId !== company.companyId) {
        req.flash('error', 'Unauthorized to approve this application.');
        return res.redirect('back');
      }
  
      application.applicationStatus = 'Approved';
      await application.save();
  
      req.flash('success', 'Application approved successfully.');
      res.redirect('back'); // Ganti dengan route yang sesuai
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to approve application.');
      res.redirect('back');     // Ganti dengan route yang sesuai
    }
  },
  
  rejectApplication: async (req, res) => {
    const { applicationId } = req.params;
    try {
      const application = await JobApplication.findByPk(applicationId);
      if (!application) {
        req.flash('error', 'Application not found.');
        return res.redirect('back');      // Ganti dengan route yang sesuai
      }
  
      // Pastikan yang mengubah adalah perusahaan yang memiliki lowongan
      const job = await Job.findByPk(application.jobId);
      const company = await Company.findOne({ where: { userId: req.session.userId } });
  
      if (job.companyId !== company.companyId) {
        req.flash('error', 'Unauthorized to reject this application.');
        return res.redirect('back');   
      }
  
      application.applicationStatus = 'Rejected';
      await application.save();
  
      req.flash('success', 'Application rejected successfully.');
      res.redirect('back');     // Ganti dengan route yang sesuai
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to reject application.');
      res.redirect('back');    // Ganti dengan route yang sesuai
    }
  },

  

};