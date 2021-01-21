module.exports = (req, res, next) => {
  req.auth = {};
  req.auth.isAuth = false;
  req.auth.isAdmin = false;
  return next();
};
