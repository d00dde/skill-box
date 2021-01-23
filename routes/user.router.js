const { Router } = require('express');
const userMiddleware = require('../middlewares/user.middleware');
const { getUserResults } = require('../database');
const { getAuth } = require('../authorization');

const router = Router();

router.use(userMiddleware);
router.get('', async (req, res, next) => {
  const { login, name, regDate, _id } = req.session.passport.user;
  const results = await getUserResults(next, _id);
  res.render('user-page', {
    user: {
      login,
      name,
      regDate: new Date(regDate),
    },
    results,
    auth: getAuth(req),
  });
});

module.exports = router;
