const { Router } = require('express');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getUsersStatistic } = require('../database');

const router = Router();

router.use(adminMiddleware);
router.get('', async (req, res) => {
  const { login, name } = req.query;
  const usersStatistic = await getUsersStatistic(login, name);
  res.render('admin-page', {
    usersStatistic,
    auth: req.auth,
  });
});

module.exports = router;
