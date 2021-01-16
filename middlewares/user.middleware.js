const { isAuth, getLogin } = require('../authorization');
const { getUser } = require('../database');

module.exports = async (req, res, next) => {
  if (!isAuth(req)) return res.status(401).send({ message: 'Unauthorized' });
  const email = getLogin(req);
  const user = await getUser(email);
  if (!user) return res.status(400).send({ message: 'Data is not a valid' });
  req.user = user;
  return next();
};
