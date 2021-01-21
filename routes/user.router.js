const { Router } = require('express');
const userMiddleware = require('../middlewares/user.middleware');
const { getUserResults } = require('../database');

const router = Router();

router.use(userMiddleware);
router.get('', async (req, res) => {
  const { login, name, regDate, _id } = req.session.user;
  const results = await getUserResults(_id);
  res.render('user-page', {
    user: {
      login,
      name,
      regDate: new Date(regDate),
    },
    results,
    auth: req.auth,
  });
});

module.exports = router;
