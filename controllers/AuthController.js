const bcrypt = require('bcrypt');

// const User = require('../models/UserModel');
const Account = require('../models/AccountModel');
const jobSeeker = require('../models/JobSeekerModel');
const company = require('../models/CompanyModel');

module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },
    
  
  loginView: (req, res) => {
    res.render('login',{ user: req.session.userId, role: req.session.role });
  },
  
  registerUser: async (req, res) => {
    const { email, password, role } = req.body;

    console.log()
    try {
      // Check user ada atau tidak
      const existingUser = await Account.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).send('User already exists');
      } else if (role == "admin") {
        return res.status(400).send('illegal role');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const accountId = (await Account.create({ email, password: hashedPassword, role })).userId;
      if (role == "Job Seeker") {
        if (await jobSeeker.findOne({ where: { userId: accountId } }) == null) {
          await jobSeeker.create({ userId: accountId });
        }

      } else if (role == "Company") {
        if (await company.findOne({ where: { userId: accountId } }) == null) {
          await company.create({ userId: accountId });
        }
      }
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },
  
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Account.findOne({ where: { email } });
      if (!user) {
        return res.status(400).send('User not found');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send('Invalid password');
      }

      req.session.userId = user.userId;
      req.session.email = user.email;
      req.session.role = user.role; // Store role as well
      if (user.role == "Job Seeker") {
        req.session.otherId = (await jobSeeker.findOne({ where: { userId: user.userId } } )).jobSeekerId;
      } else if (user.role == "Company") {
        req.session.otherId = (await company.findOne({ where: { userId: user.userId } } )).companyId;
      }
      // Redirect based on role
      if (user.role === 'Admin') {
        return res.redirect('/admin'); // Redirect to admin dashboard
      }
      else {
        return res.redirect('/dashboard'); // Redirect to user dashboard
      }
      console.log(user.role);  // Debugging untuk melihat apakah 'role' ada di session

    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  
  logoutUser: (req, res) => {
    req.session.destroy(err => {
      if (err) {
          console.error(err);
          return res.status(500).send('Server error');
      }
      res.redirect('/login');
    });
  },

  test: async (req, res) => {
    console.log("WAHJDHJDFAHJSDFHJASHJF")
    const users = await Account.findAll();
    res.render('test', { users });
  }
};
  