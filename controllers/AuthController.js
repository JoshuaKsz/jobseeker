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
    const { email, password,"retype-password": retypePassword, role } = req.body;

    console.log()
    try {
      if (!email) {
        return res.render("register", { error: "Email is required!" });
      }
      // Validasi password kosong
      if (!password) {
        return res.render("register", { error: "Password is required!" });
      }
      // Validasi retype password kosong
      if (!retypePassword) {
        return res.render("register", { error: "Retype Password is required!" });
      }
      // Validasi role kosong
      if (!role) {
        return res.render("register", { error: "Role is required!" });
      }
      // Validasi password dan retype password
      if (password !== retypePassword) {
        return res.render("register", { error: "Passwords do not match!" });
      }
      // Check user ada atau tidak
      const existingUser = await Account.findOne({ where: { email } });
      if (existingUser) {
        req.flash('error', 'Email already registered!');
        return res.redirect('/register'); // Redirect dengan flash message
      } else if (role == "admin") {
        req.flash('error', 'Illegal role!');
        return res.redirect('/register');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const accountId = (await Account.create({ email, password: hashedPassword, role })).userId;
      if (role == "Job Seeker") {
        if (await jobSeeker.findOne({ where: { userId: accountId } }) == null) {
          await jobSeeker.create({ userId: accountId });
        }

      } else if (role == "Company") {
        if (await company.findOne({ where: { userId: accountId } }) == null) {
          await company.create({ userId: accountId, companyName: accountId });
        }
      }
      req.flash('success', 'Registration successful! Please login.');
      res.redirect('/register');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Registration failed. Please try again later.');
      res.redirect('/register');
    }
  },
  
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Account.findOne({ where: { email } });
      if (!user) {
        return res.render("login", { error: "Email not found!" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.render("login", { error: "Password Invalid!" });
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
      // if (user.role === 'Admin') {
      //   return res.redirect('/admin'); // Redirect to admin dashboard
      // }
      if(user.role != 'Admin'){
        req.flash('success', 'Login success');
        return res.redirect('/dashboard'); // Redirect to user dashboard
      }
      console.log(user.role);  // Debugging untuk melihat apakah 'role' ada di session

    } catch (err) {
      console.error(err);
      req.flash('error', 'Login failed. Please try again later.');
      return res.redirect('/login');
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