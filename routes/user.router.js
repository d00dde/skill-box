const { Router } = require('express');
const userMiddleware = require('../middlewares/user.middleware');
const { getUserResults } = require('../database');

const router = Router();

router.use(userMiddleware);
router.get('', async (req, res) => {
  const results = await getUserResults(req.user._id);
  const { login, name, regDate } = req.user;
  res.render('user-page', {
    user: { login, name, regDate },
    results,
  });
});

module.exports = router;
