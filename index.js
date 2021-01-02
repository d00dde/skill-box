const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DELAY = 1000;  // Задержка сервера для проверки обработки ожидания ответа на "фронте"

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.get('/results', (_, res) => {
	setTimeout(() => {
		try {
			if(!fs.existsSync('database.json')) {
				res.send([]);
				return;
			}
			const fd = fs.readFileSync('database.json',"utf8");
			const top10 = JSON.parse(fd).topScores.slice(0, 10);
			res.send(top10);
		} catch (err) {
			res.status(500).send({ message: 'Terrible server error'});
		}
	}, DELAY);
});
app.post('/results', (req, res) => {
	const { name, score } = req.body;
	if(!validateResults(name, score)){
		res.status(400).send({ message: 'Scores data is not a valid'});
		return;
	}
	setTimeout(() => {
		try {
			let topScores = [];
			if(fs.existsSync('database.json')) {
				const fd = fs.readFileSync('database.json',"utf8");
				topScores = JSON.parse(fd).topScores;
				const exist = topScores.find((item) => item.name === name);
				if(exist) {
					exist.score = score;
				} else {
					topScores.push({ name, score });
				}
				topScores.sort((a, b) => +b.score - +a.score);
			} else {
				topScores.push({ name, score });
			}
			fs.writeFileSync('database.json', JSON.stringify({ topScores }));
			res.status(201).send({ message: 'Score saved'});
		} catch (err) {
			res.status(500).send({ message: 'Terrible server error'});
		}
	}, DELAY);
});
app.get('*', (_, res) => {
	setTimeout(() => {
		res.status(404).sendFile(path.join(__dirname, 'client/notFound.html'));
	}, DELAY);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function validateResults(name, score) {
	console.log(score === 0 )
	if(typeof name !== 'string' || name.length === 0)
		return false;
	if(!Number.isInteger(score) || score === 0)
		return false;
	return true;
}
