const { isAuth } = require('../authorization');

module.exports = async (req, res, next) => {
  if (isAuth(req)) {
    return next();
  }
  return res.redirect('/');
};
