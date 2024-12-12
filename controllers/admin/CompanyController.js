const Company = require('../../models/CompanyModel'); 
const Account = require('../../models/AccountModel'); 
const Job = require('../../models/JobModel');
const { Op } = require('sequelize');
module.exports = {
  createUpdateCompany: async (req, res) => {
    const { companyName, industry, phone, city, country, email } = req.body;
    if (!req.session.userId) {
      return res.status(400).send('User not logged in');
    }
    try {
      const existingAccount = await Account.findOne({ where: { userId: req.session.userId } });
      if (!existingAccount) {
        return res.status(400).send('User does not exist');
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
      } else {
        console.log("create?");
        await Company.create({ userId, companyName, industry, phone, city, country, email });
      }

      res.redirect('/admin/company');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
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
        return res.status(404).send('Company not found');
      }
      await company.destroy();
      res.redirect('/admin/company');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getCompanyProfile: async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const userId = req.session.userId;
      // Find company details
      const company = await Company.findByPk(companyId);
      
      if (!company) {
          return res.status(404).send('Company not found');
      }

      // Find active jobs for this company
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
          userId
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  comapnyProfileView: async (req, res) => {
    try {
      const { companyId } = req.params;
  
      const company = await Company.findOne({ where: { companyId: companyId } });
      if (!company) {
        return res.status(404).send('Company not found');
      }
      res.render('company/companyViewer', { company: company})
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
  }

  

};