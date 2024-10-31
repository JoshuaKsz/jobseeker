const bcrypt = require('bcrypt');

const Account = require('../../models/AccountModel');

module.exports = {
  createUpdateAccount: async (req, res) => {
    const { userId, email, password, role } = req.body;
    console.log(userId, email, password, role);
    
    try {
      const existingUser = await Account.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).send('User already exists');
      } else if (!password) {
        return res.status(400).send("password can't be null");
      }

      const existingId = await Account.findOne({ where: { userId } });
      if (existingId) {
        console.log("edit/update")

        if (email) existingId.email = email;
        if (password) existingId.password = await bcrypt.hash(password, 10);
        if (role) existingId.role = role;
        existingId.save();
      } else {
        console.log("create?")
        const hashedPassword = await bcrypt.hash(password, 10);
        await Account.create({ email, password: hashedPassword, role });
      }
      res.redirect('/admin/account');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const users = await Account.findAll();
    //   res.status(200).json(users);
      res.render("admin/account", { users });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAccountById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await Account.findOne({ where: { userId: id } });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  // updateAccount: async (req, res) => {
  //   const { id } = req.params;
  //   const { email, password, role } = req.body;

  //   try {
  //     const user = await Account.findOne({ where: { userId: id } });
  //     if (!user) {
  //       return res.status(404).send('User not found');
  //     }

  //     if (email) user.email = email;
  //     if (password) user.password = await bcrypt.hash(password, 10);
  //     if (role) user.role = role;

  //     await user.save();
  //     res.status(200).send('User updated successfully');
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).send('Server error');
  //   }
  // },

  deleteAccount: async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    try {
      const user = await Account.findOne({ where: { userId: id } });
      if (!user) {
        return res.status(404).send('User not found');
      }
      await user.destroy();
      res.redirect('/admin/account');
    } catch (err) {
      console.error(err);
      return res.send(req.params);
      return res.status(500).send('Server error');
    }
  },
};
