const { isAuth, getLogin } = require('../authorization');
const { getUser } = require('../database');

module.exports = async (req, res, next) => {
	return next();
  if (!isAuth(req)) return res.status(401).send({ message: 'Unauthorized' });
  const email = getLogin(req);
  const user = await getUser(email);
	if (!user) return res.status(400).send({ message: 'Data is not a valid' });
	if(user.role === 'admin') {
		req.user = user;
		return next();
	}
  return res.status(403).send({ message: 'Forbidden' });
};
