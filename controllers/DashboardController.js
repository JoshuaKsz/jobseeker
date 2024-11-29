module.exports = {
  dashboardView: (req, res) => {
    res.render('dashboard', { checkUser: req.session.email, role: req.session.role });
  }
}
