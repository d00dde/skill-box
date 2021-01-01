const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DELAY = 1000;  // Задержка сервера для проверки обработки ожидания ответа на "фронте"

app.use(express.static('client'));
app.use(express.json());
app.get('/results', (req, res) => {
	setTimeout(() => {
		if(!fs.existsSync('database.json')) {
			res.send([]);
			return;
		}
		fs.readFile('database.json',"utf8", (err, fd) => {
			if (err) {
				res.status(500).send({ message: 'Terrible server error'});
				console.log(err);
				return;
			}
			const top10 = JSON.parse(fd).topScores.slice(0, 10);
			res.send(top10);
		});
	}, DELAY);
});
app.post('/results', (req, res) => {
	setTimeout(() => {
		const { name, score } = req.body;
		let topScores = [];
		if(fs.existsSync('database.json')) {
			fs.readFile('database.json',"utf8", (err, fd) => {
				if (err) {
					res.status(500).send({ message: 'Terrible server error'});
					console.log(err);
					return;
				}
				topScores = JSON.parse(fd).topScores;
				const exist = topScores.find((item) => item.name === name);
				if(exist) {
					exist.score = score;
				} else {
					topScores.push({ name, score });
				}
				topScores.sort((a, b) => +b.score - +a.score);
			});
		} else {
			topScores.push({ name, score });
		}
		fs.writeFile('database.json', JSON.stringify({ topScores }), (err) => {
			if (err) {
				res.status(500).send({ message: 'Terrible server error'});
				console.log(err);
				return;
			}
			res.status(201).send({ message: 'Score saved'});
		});
	}, DELAY);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
})
