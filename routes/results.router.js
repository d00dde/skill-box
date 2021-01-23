const { Router } = require('express');
const userMiddleware = require('../middlewares/user.middleware');
const { addResult, getUserBest, getTop10 } = require('../database');
const { dataNoValid, scoreSaved } = require('../responses/results.responses');

const router = Router();

router.use(userMiddleware);
router.get('', async (req, res, next) => {
  const top10 = await getTop10(next);
  const best = await getUserBest(next, req.session.passport.user._id);
  res.send({ top10, best });
});
router.post('', async (req, res, next) => {
  const { score } = req.body;
  if (!validateResults(score)) return dataNoValid(res);
  await addResult(next, req.session.passport.user.login, score);
  return scoreSaved(res);
});

function validateResults(score) {
  if (!Number.isInteger(score) || score === 0) return false;
  return true;
}

module.exports = router;
