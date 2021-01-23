module.exports = {
  isAuth: (req) => req.isAuthenticated(),
  isAdmin: (req) => req.session.passport.user.role === 'admin',
  getAuth: (req) => {
    return {
      isAuth: req.isAuthenticated(),
      isAdmin: req.session.passport?.user?.role === 'admin',
    };
  },
};
