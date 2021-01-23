const { Router } = require('express');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getAuth } = require('../authorization');

const {
  getUsers,
  fillUsers,
  getUsersLength,
  setAdmin,
} = require('../database');

const router = Router();

router.use(adminMiddleware);
router.get('', async (req, res, next) => {
  const {
    login = '',
    name = '',
    gamesDirection = 0,
    topScoresDirection = 0,
    offset = 0,
    limit = 10,
  } = req.query;
  const usersLength = await getUsersLength(
    next,
    login,
    name,
    gamesDirection,
    topScoresDirection,
  );
  const queryUsers = await getUsers(
    next,
    login,
    name,
    gamesDirection,
    topScoresDirection,
    offset,
    limit,
  );
  res.render('admin-page', {
    queryUsers,
    auth: getAuth(req),
    usersLength,
    search: {
      login,
      name,
      gamesDirection,
      topScoresDirection,
      offset,
      limit,
    },
  });
});
router.post('/setAdmin', async (req, res, next) => {
  await setAdmin(next, req.body.id);
  res.json({ message: 'OK' });
});
router.post('/fill', async (req, res, next) => {
  fillUsers(next);
});

module.exports = router;
