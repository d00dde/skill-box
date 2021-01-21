const { isAuth, isAdmin } = require('../authorization');

module.exports = async (req, res, next) => {
  if (isAuth(req)) {
    req.auth.isAuth = true;
    req.auth.isAdmin = isAdmin(req);
    return next();
  }
  return res.status(401).send({ message: 'Unauthorized' });
};
