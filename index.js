
function setCSS (css) {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
}
function getRandom(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

class TimerControl {
	constructor({GAME_TIME = 60000, REFRESH_TIME = 400}) {
		this.GAME_TIME = GAME_TIME;
		this.REFRESH_TIME = REFRESH_TIME;
		this.startTime = 0;
		this.endTime = 0;
		this.timeLeft = 0;
		this.gameTimer = 0;
		this.ticInterval = 0;
	}
	stop() {
		this.timeLeft = this.endTime - Date.now();
		clearTimeout(this.gameTimer);
		clearInterval(this.ticInterval);
	}
	resume(endCallback, timerCallback, isStart){
		isStart ? this.timeLeft = this.GAME_TIME : null;
		this.startTime = Date.now();
		this.endTime = this.startTime + this.timeLeft;
		this.gameTimer = setTimeout(() => {
			endCallback();
		}, this.timeLeft);
		this.ticInterval = setInterval (() => {
			const toEnd  = this.endTime - Date.now();
			timerCallback(Math.round(toEnd/1000));
		}, this.REFRESH_TIME);
	}

}

class Game {
	constructor(
			{start, newGame, scoreIndicator, timeCounter, gameField, blur},
			{	ROW_MAX = 30, COL_MAX = 30, COLORS = [ 'red', 'blue'], START_ACTIVE_CELLS = 3, MAX_PAINTED_CELLS = 2},
			timerOptions,
			scoreTableOptions,
			) {
		this.$startBtn = document.querySelector(start);
		this.$newGameBtn = document.querySelector(newGame);
		this.$scoreIndicator = document.querySelector(scoreIndicator);
		this.$timeCounter = document.querySelector(timeCounter);
		this.$gameField = document.querySelector(gameField);
		this.$blur = document.querySelector(blur);
		this.ROW_MAX = ROW_MAX;
		this.COL_MAX = COL_MAX;
		this.COLORS = COLORS;
		this.START_ACTIVE_CELLS = START_ACTIVE_CELLS;
		this.MAX_PAINTED_CELLS = MAX_PAINTED_CELLS;
		this.painted = 0;
		this.currentScore = 0;
		this.isRunning = false;
		this.timerControl = new TimerControl(timerOptions);
		this.scoreTable = new ScoreTable (scoreTableOptions);
		this.init();
	}
	init () {
		this.$startBtn.onclick = this.startHandler.bind(this);
		this.$startBtn.dataset.status = 'play';
		this.$newGameBtn.onclick = this.newGameHandler.bind(this);
		this.scoreTable.init();
		this.createField();
		this.$cells = document.querySelectorAll('.cell');
	}
	newGameHandler() {
		this.$newGameBtn.disabled = true;
		this.$startBtn.disabled = false;
		this.startGame();
	}
	startHandler() {
		if(this.$startBtn.dataset.status === 'play') {
			this.$startBtn.innerText = 'Старт';
			this.$startBtn.dataset.status = 'paused';
			this.pauseGame();
		} else {
			this.$startBtn.innerText = 'Пауза';
			this.$startBtn.dataset.status = 'play';
			this.resumeGame();
		}
	}
	clickHandler (e) {
		if(!this.isRunning)
				return;
		if(!e.target.classList.contains('cell'))
			return;
		const cell = e.target;
		if(!(cell.dataset.status === 'paint'))
			return;
		this.painted--;
		this.$scoreIndicator.innerText = ++this.currentScore;
		cell.dataset.status === 'clear';
		cell.style.backgroundColor = '';
		this.paintRandomCells();
	}
	createField () {
		this.$gameField.innerHTML = '';
		const style = window.getComputedStyle(this.$gameField);
		setCSS (
			`.cell {
				width: ${Math.floor(parseInt(style.width))/this.COL_MAX}px;
				height: ${Math.floor(parseInt(style.height))/this.ROW_MAX}px;
			}`);

		let number = 0;
		for(let i = 0; i < this.ROW_MAX; i++) {
			for(let j = 0; j < this.COL_MAX; j++) {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.dataset.id = number++;
				cell.dataset.status = 'clear';
				// cell.textContent = number - 1;
				this.$gameField.appendChild(cell);
			}
		}
		this.$gameField.onclick = this.clickHandler.bind(this);
	}
	startGame() {
		this.clearGame();
		this.paintRandomCells();
		this.resumeGame(true);
	}
	pauseGame() {
		this.timerControl.stop();
		this.isRunning = false;
		this.$blur.classList.add('active');
	}

	resumeGame(isStart) {
		this.timerControl.resume(this.stopGame.bind(this), (timeLeft) => {
			this.$timeCounter.innerText = timeLeft;
		} ,isStart);
		this.isRunning = true;
		this.$blur.classList.remove('active');
	}
	stopGame() {
		this.timerControl.stop();
		this.isRunning = false;
		this.$newGameBtn.disabled = false;
		this.$startBtn.disabled = true;
		this.$startBtn.innerText = 'Пауза';
	}
	clearGame() {
		this.currentScore = 0;
		this.$scoreIndicator.innerText = 0;
		this.painted = 0;
		this.$cells.forEach((cell) => {
			cell.dataset.status = 'clear';
			cell.style.backgroundColor = '';
		});
	}
	paintRandomCells() {
		const count = this.painted ? getRandom(0, this.MAX_PAINTED_CELLS) : this.START_ACTIVE_CELLS;
		for(let i = 0; i < count; i++){
			while(true){
				const candidate = this.$cells[getRandom(0, this.$cells.length-1)];
				if(candidate.dataset.status === 'clear'){
					candidate.style.backgroundColor = this.COLORS[getRandom(0, this.COLORS.length-1)];
					this.painted++;
					candidate.dataset.status = 'paint';
					break;
				}
			}
		}
	}

}

class ScoreTable {
	constructor({table}) {
		this.$table = document.querySelector(table);

	}
	init() {
		const topScores = this.getTopScores();

	}
	getTopScores() {
		return JSON.parse(window.localStorage.getItem('topScores'));
	}
	saveTopScores(scores) {
		window.localStorage.setItem('topScores', JSON.stringify(scores));
	}

}

const game = new Game ({
	start: '.start-btn',
	newGame: '.new-game-btn',
	scoreIndicator: '.current-score',
	timeCounter: '.time-counter',
	gameField: '.game-field',
	blur: '.blur',
}, {
	ROW_MAX: 30,
	COL_MAX: 20,
	COLORS: [ 'red', 'blue', 'yellow'],
	START_ACTIVE_CELLS: 3,
	MAX_PAINTED_CELLS: 2,
}, {
	GAME_TIME: 60000,
	REFRESH_TIME: 400,
},{
	table: '.score-table',
});
