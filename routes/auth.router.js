const { Router } = require('express');
const { isAuth, logIn, logout } = require('../authorization');
const checkUser = require('../database').checkUser;

const router = Router();

router.get('/', async (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('auth');
});

router.get('/game', (req, res) => {
  if (isAuth(req)) {
    return res.render('game');
  }
  return res.redirect('/');
});

router.post('/login', async (req, res) => {
  const { login, password } = sanitize(req.body);
  const user = await checkUser(login, password);
  if (user) {
    logIn(res, user.name, user.login);
    return res.status(200).send({ message: 'Authorization successful' });
  }
  return res.status(400).send({ message: 'Invalid login or password' });
});
router.post('/logout', (req, res) => {
  logout(res);
  return res.status(200).send({ message: 'Logout successful' });
});

module.exports = router;

function sanitize({ login, password, name }) {
  return {
    login: login.trim(),
    password,
  };
}
