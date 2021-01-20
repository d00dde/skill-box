const { Router } = require('express');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getUsersStatistic } = require('../database');

const router = Router();

router.use(adminMiddleware);
router.get('', async (req, res) => {
  const usersStatistic = await getUsersStatistic();
  res.render('admin-page', {
    usersStatistic,
  });
});

module.exports = router;
