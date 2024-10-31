const Company = require('../../models/CompanyModel'); 
const Account = require('../../models/AccountModel'); 

module.exports = {
  createUpdateCompany: async (req, res) => {
    const { companyId, userId, companyName, industry, phone, city, country, email } = req.body;
    
    try {
      const existingAccount = await Account.findOne({ where: { userId } });
      if (!existingAccount) {
        return res.status(400).send('User does not exist');
      }

      const existingCompany = await Company.findOne({ where: { companyId } });
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
      const companies = await Company.findAll();
      res.render("admin/company", { companies });
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
};
