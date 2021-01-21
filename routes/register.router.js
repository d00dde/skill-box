const { Router } = require('express');
const { isAuth, logIn } = require('../authorization');
const { getUser, addUser } = require('../database');

const router = Router();

router.get('/', async (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('register', { auth: req.auth });
});
router.post('/check', async (req, res) => {
  const { login } = req.body;
  if (await getUser(login)) {
    return res.status(200).send({ isFree: false });
  }
  return res.status(200).send({ isFree: true });
});

router.post('/', async (req, res) => {
  const { login, password, name } = sanitize(req.body);
  if (!validateInput(login, password, name))
    return res.status(400).send({ message: 'Invalid register data' });
  const exist = await getUser(login);
  if (exist)
    return res.status(409).send({ message: 'This user already exist' });
  const user = await addUser(login, password, name, req.ip);
  logIn(req, user);
  return res.status(200).send({ message: 'Registration successful' });
});

module.exports = router;

function sanitize({ login, password, name }) {
  return {
    login: login.trim(),
    password,
    name: name.trim(),
  };
}

function validateInput(login, password, name) {
  if (!validateLogin(login)) return false;
  if (!validatePassword(password)) return false;
  if (!validateName(name)) return false;
  return true;
}

function validateLogin(login) {
  if (!login.length) return false;
  return login.match(/[a-z0-9]/g).join('') === login;
}
function validatePassword(password) {
  return password.length > 7;
}
function validateName(name) {
  if (!name.length) return false;
  return name.match(/[a-z0-9а-я ]/gi).join('') === name;
}
