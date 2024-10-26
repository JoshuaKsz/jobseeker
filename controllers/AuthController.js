const bcrypt = require('bcrypt');

const User = require('../models/UserModel');

module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },
    
  
  loginView: (req, res) => {
    res.render('login');
  },
  
  registerUser: async (req, res) => {
    const { username, password } = req.body;
    console.log()
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ username, password: hashedPassword });
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },
  
  loginUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).send('User not found');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send('Invalid password');
      }

      // Store user info in session (if using sessions)
      req.session.userId = user.username;
      res.redirect('/dashboard/somethingDisplay'); // Redirect to dashboard or another page
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
  }
};
  