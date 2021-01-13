const { Router } = require('express');
const fs = require('fs');
const DELAY = require('../config').DELAY;
const isAuth = require('../authorization').isAuth;

const router = Router();

router.use((req, res, next) => {
  if (!isAuth(req)) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  return next();
});
router.get('', (_, res) => {
  setTimeout(() => {
    if (!fs.existsSync('database.json')) {
      res.send([]);
      return;
    }
    const fd = fs.readFileSync('database.json', 'utf8');
    const top10 = JSON.parse(fd).topScores.slice(0, 10);
    res.send(top10);
  }, DELAY);
});
router.post('', (req, res) => {
  const { name, score } = req.body;
  if (!validateResults(name, score)) {
    res.status(400).send({ message: 'Scores data is not a valid' });
    return;
  }
  setTimeout(() => {
    let topScores = [];
    if (fs.existsSync('database.json')) {
      const fd = fs.readFileSync('database.json', 'utf8');
      topScores = JSON.parse(fd).topScores;
      const exist = topScores.find((item) => item.name === name);
      if (exist) {
        if (exist.score < score) {
          exist.score = score;
        }
      } else {
        topScores.push({ name, score });
      }
      topScores.sort((a, b) => +b.score - +a.score);
    } else {
      topScores.push({ name, score });
    }
    fs.writeFileSync('database.json', JSON.stringify({ topScores }));
    res.status(201).send({ message: 'Score saved' });
  }, DELAY);
});

function validateResults(name, score) {
  if (typeof name !== 'string' || name.length === 0) return false;
  if (!Number.isInteger(score) || score === 0) return false;
  return true;
}

module.exports = router;
