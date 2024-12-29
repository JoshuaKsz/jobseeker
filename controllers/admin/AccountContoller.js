const bcrypt = require('bcrypt');

const Account = require('../../models/AccountModel');
const JobSeeker = require('../../models/JobSeekerModel');
const Company = require('../../models/CompanyModel');

module.exports = {
  createUpdateAccount: async (req, res) => {
    const { userId, email, password,"retype-password": retypePassword, role } = req.body;
    
 
    try {
      const existingUser = await Account.findOne({ where: { email } });
      if (!password) {
        req.flash('error', 'Password can not be null');
        return res.redirect('/admin/account');
      }
      if (!retypePassword) {
        req.flash('error', 'Retype Password is required!');
        return res.redirect('/admin/account');
      }
      if (password !== retypePassword) {
        req.flash('error', 'Passwords do not match!');
        return res.redirect('/admin/account');
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
      req.flash('success', 'Update Account successfully!.');
      res.redirect('/admin/account');
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        req.flash('error', 'Duplicate email found. Please use a different email.');
        return res.redirect('/admin/account');
      }
      console.error(err);
      req.flash('error', 'Account Update Failed!');
      return res.redirect('/admin/account');
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const userId = req.session.userId; // Ambil userId dari sesi pengguna yang login
      if (!userId) {
        req.flash('error', 'User not logged in');
        return res.redirect('/login');
      }
  
      const user = await Account.findOne({ where: { userId } }); // Hanya ambil data user yang sesuai dengan sesi login
      if (!user) {
        req.flash('error', 'User not logged in');
        return res.redirect('/login');
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
    const { id } = req.params;
    try {
      const user = await Account.findOne({ where: { userId: id } });
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/admin/account');
      }
      const jobSeekerData = await JobSeeker.findOne({ where: { userId: id } });
      if (jobSeekerData) {
        await jobSeekerData.destroy();
      }

      const companyData = await Company.findOne({ where: { userId: id } });
      if (companyData) {
        await companyData.destroy();
      }
      await user.destroy();
      req.flash('success', 'User deleted successfully!');
      res.redirect('/logout'); // Lebih baik redirect ke /logout setelah menghapus akun
      
    } catch (err) {
      console.error(err);
  
      // Cek jenis error
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        req.flash('error', 'Cannot delete user. This user is referenced by other data (e.g., Job Seeker or Company).');
      } else {
        req.flash('error', 'Failed to delete user. Please try again later.');
      }
  
      return res.redirect('/admin/account');
    }
  },
};
