module.exports = {
  dashboardView: (req, res) => {
    res.render('dashboard', { user: req.session.userId });
  }
}
