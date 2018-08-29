module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'You must login to use this');
    res.redirect('/auth/login');
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role == 'employer') {
        res.redirect('/employer-dashboard');
      } else {
        res.redirect('/dashboard');
      }

    } else {
      return next();
    }
  }
}