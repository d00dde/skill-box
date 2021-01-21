module.exports = {
  isAuth: (req) => !!req.session.user,
  isAdmin: (req) => req.session.user.role === 'admin',
  logIn: (req, user) => {
    req.session.user = user;
  },
  logout: (req) => {
    req.session.destroy();
  },
};
