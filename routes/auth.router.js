const { Router } = require('express');
const { isAuth, logIn, logout } = require('../authorization');
const checkUser = require('../database').checkUser;
const userMiddleware = require('../middlewares/user.middleware');

const router = Router();

router.get('/', async (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('auth', { auth: req.auth });
});

router.get('/game', userMiddleware, (req, res) => {
  if (isAuth(req)) {
    return res.render('game', { auth: req.auth, name: req.session.user.name });
  }
  return res.redirect('/');
});

router.post('/login', async (req, res) => {
  const { login, password } = sanitize(req.body);
  const user = await checkUser(login, password);
  if (user) {
    logIn(req, user);
    return res.status(200).send({ message: 'Authorization successful' });
  }
  return res.status(400).send({ message: 'Invalid login or password' });
});
router.post('/logout', (req, res) => {
  logout(req);
  return res.status(200).send({ message: 'Logout successful' });
});

module.exports = router;

function sanitize({ login, password }) {
  return {
    login: login.trim(),
    password,
  };
}
