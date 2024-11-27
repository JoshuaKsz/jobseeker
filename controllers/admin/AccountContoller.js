const bcrypt = require('bcrypt');

const Account = require('../../models/AccountModel');

module.exports = {
  createUpdateAccount: async (req, res) => {
    const { userId, email, password, role } = req.body;
    
 
    try {
      const existingUser = await Account.findOne({ where: { email } });
      if (!password) {
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
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).send("Duplicate email found. Please use a different email.");
      }
      console.error(err);
      return res.status(500).send('Server error');
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const userId = req.session.userId; // Ambil userId dari sesi pengguna yang login
      if (!userId) {
        return res.status(403).send('Access denied'); // Pastikan user login
      }
  
      const user = await Account.findOne({ where: { userId } }); // Hanya ambil data user yang sesuai dengan sesi login
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render("admin/account", {
        users: [user], // Kirim data pengguna dalam bentuk array untuk kompatibilitas dengan `each` di pug
        checkUser: req.session.email,
        userId: user.userId,
        password: '', // Jangan kirim password langsung ke front-end demi keamanan
        role: user.role,
      });
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
