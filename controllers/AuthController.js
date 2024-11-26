const bcrypt = require('bcrypt');

// const User = require('../models/UserModel');
const Account = require('../models/AccountModel');

module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },
  
  
  loginView: (req, res) => {
    res.render('login');
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

      await Account.create({ email, password: hashedPassword, role });
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

      // Redirect based on role
      if (user.role === 'Admin') {
        return res.redirect('/admin'); // Redirect to admin dashboard
      } else {
        return res.redirect('/dashboard/somethingDisplay'); // Redirect to user dashboard
      }
      
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
  