const { Router } = require('express');
const adminMiddleware = require('../middlewares/admin.middleware');
const {
  getUsers,
  fillUsers,
  getUsersLength,
  setAdmin,
} = require('../database');

const router = Router();

router.use(adminMiddleware);
router.get('', async (req, res) => {
  const {
    login = '',
    name = '',
    gamesDirection = 0,
    topScoresDirection = 0,
    offset = 0,
    limit = 10,
  } = req.query;
  const usersLength = await getUsersLength(
    login,
    name,
    gamesDirection,
    topScoresDirection,
  );
  const queryUsers = await getUsers(
    login,
    name,
    gamesDirection,
    topScoresDirection,
    offset,
    limit,
  );
  res.render('admin-page', {
    queryUsers,
    auth: req.auth,
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
router.post('/setAdmin', async (req, res) => {
  await setAdmin(req.body.id);
  res.json({ message: 'OK' });
});
router.post('/fill', async (req, res) => {
  fillUsers();
});

module.exports = router;
