const { Router } = require('express');
const { isAuth } = require('../authorization');
const { getUser, addUser } = require('../database');
const { getAuth } = require('../authorization');
const {
  registerSuccess,
  registerDataFail,
  userExistFail,
  loginIsFree,
  loginIsBusy,
} = require('../responses/register.responses');

const router = Router();

router.get('/', async (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('register', { auth: getAuth(req) });
});
router.post('/check', async (req, res, next) => {
  const { login } = req.body;
  if (await getUser(next, login)) {
    return loginIsBusy(res);
  }
  return loginIsFree(res);
});

router.post('/', async (req, res, next) => {
  const { login, password, name } = sanitize(req.body);
  if (!validateInput(login, password, name)) return registerDataFail(res);
  const exist = await getUser(next, login);
  if (exist) return userExistFail(res);
  const user = await addUser(next, login, password, name, req.ip);
  req.logIn(user, (err) => {
    if (err) return next(err);
  });
  return registerSuccess(res);
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
