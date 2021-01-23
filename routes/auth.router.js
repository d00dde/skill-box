const { Router } = require('express');
const { isAuth } = require('../authorization');
const userMiddleware = require('../middlewares/user.middleware');
const { localAuth } = require('../middlewares/passport.middleware');
const { loginSuccess, logoutSuccess } = require('../responses/auth.responses');
const { getAuth } = require('../authorization');

const router = Router();

router.get('/', async (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('auth', { auth: getAuth(req) });
});

router.get('/game', userMiddleware, (req, res) => {
  if (isAuth(req)) {
    return res.render('game', {
      auth: getAuth(req),
      name: req.session.passport.user.name,
    });
  }
  return res.redirect('/');
});

router.post('/login', localAuth, (_, res) => {
  return loginSuccess(res);
});
router.post('/logout', (req, res) => {
  req.logOut();
  return logoutSuccess(res);
});

module.exports = router;
