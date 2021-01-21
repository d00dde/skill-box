const { Router } = require('express');
const userMiddleware = require('../middlewares/user.middleware');
const { addResult, getUserBest, getTop10 } = require('../database');

const router = Router();

router.use(userMiddleware);
router.get('', async (req, res) => {
  const top10 = await getTop10();
  const best = await getUserBest(req.session.user._id);
  res.send({ top10, best });
});
router.post('', async (req, res) => {
  const { score } = req.body;
  if (!validateResults(score))
    return res.status(400).send({ message: 'Data is not a valid' });
  await addResult(req.session.user.login, score);
  res.status(201).send({ message: 'Score saved' });
});

function validateResults(score) {
  if (!Number.isInteger(score) || score === 0) return false;
  return true;
}

module.exports = router;
