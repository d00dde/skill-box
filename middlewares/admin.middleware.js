const { isAuth, isAdmin } = require('../authorization');

module.exports = async (req, res, next) => {
  if (isAuth(req) && isAdmin(req)) {
    return next();
  }
  return res.redirect('/');
};
