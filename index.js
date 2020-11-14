
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
	constructor({GAME_TIME = 60000, REFRESH_TIME = 400}, domHelper) {
		this.GAME_TIME = GAME_TIME;
		this.REFRESH_TIME = REFRESH_TIME;
		this.startTime = 0;
		this.endTime = 0;
		this.timeLeft = 0;
		this.gameTimer = 0;
		this.ticInterval = 0;
		this.domHelper = domHelper;
	}
	stop() {
		this.timeLeft = this.endTime - Date.now();
		clearTimeout(this.gameTimer);
		clearInterval(this.ticInterval);
	}
	resume(endCallback, isStart){
		isStart ? this.timeLeft = this.GAME_TIME : null;
		this.startTime = Date.now();
		this.endTime = this.startTime + this.timeLeft;
		this.gameTimer = setTimeout(() => {
			endCallback();
		}, this.timeLeft);
		this.ticInterval = setInterval (() => {
			const toEnd  = this.endTime - Date.now();
			this.domHelper.setTimeLeft(Math.round(toEnd/1000));
		}, this.REFRESH_TIME);
	}
}
class DOMHelper {
	constructor ({ROW_MAX = 30, COL_MAX = 30, pause, newGame, scoreIndicator, timeCounter, gameField, blur, scoresList}) {
		this.ROW_MAX = ROW_MAX;
		this.COL_MAX = COL_MAX;
		this.$pauseBtn = document.querySelector(pause);
		this.$newGameBtn = document.querySelector(newGame);
		this.$scoreIndicator = document.querySelector(scoreIndicator);
		this.$timeCounter = document.querySelector(timeCounter);
		this.$gameField = document.querySelector(gameField);
		this.$blur = document.querySelector(blur);
		this.$scoresList = document.querySelector(scoresList);
		this.$cells = null;
	}
	init(pauseHandler, newGameHandler, clickHandler) {
		this.$pauseBtn.onclick = pauseHandler;
		this.$newGameBtn.onclick = newGameHandler;
		this.$gameField.onclick = clickHandler;
		this.$pauseBtn.dataset.status = 'play';
		this.createField();
		this.$cells = document.querySelectorAll('.cell');
	}
	startGame() {
		this.$newGameBtn.disabled = true;
		this.$pauseBtn.disabled = false;
	}
	pauseGame() {
		this.$blur.classList.add('active');
	}
	resumeGame() {
		this.$blur.classList.remove('active');
	}
	endGame() {
		this.$newGameBtn.disabled = false;
		this.$pauseBtn.disabled = true;
		this.$pauseBtn.innerText = 'Пауза';
	}
	clearGame() {
		this.$scoreIndicator.innerText = 0;
		this.endGame();
		this.$cells.forEach((cell) => {
			cell.dataset.status = 'clear';
			cell.style.backgroundColor = '';
		});
	}
	changeMode(isRunning) {
		if(isRunning) {
			this.$pauseBtn.innerText = 'Старт';
			this.$pauseBtn.dataset.status = 'paused';

		} else {
			this.$pauseBtn.innerText = 'Пауза';
			this.$pauseBtn.dataset.status = 'play';
		}
	}
	setScore(score) {this.$scoreIndicator.innerText = score;}
	setTimeLeft(timeLeft) {this.$timeCounter.innerText = timeLeft;}
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
	}
	getRandomCell(){
		return this.$cells[getRandom(0, this.$cells.length-1)];
	}
	renderTopScores(scores) {
		const content = scores.map((item) => {
			return`
				<li>
					<span class="name">${item.name}</span>
					<span class="score">${item.score}</span>
				</li>
			`;
		}).join('');
		this.$scoresList.innerHTML = content;
	}
}

class Modal {
	constructor(okHandler, cancelHandler) {
		this.$modal = document.querySelector('.modal');
		this.$input = this.$modal.querySelector('input');
		this.$okBtn = this.$modal.querySelector('.save');
		this.$cancelBtn = this.$modal.querySelector('.cancel');
		this.okHandler = okHandler;
		this.cancelHandler = cancelHandler;
		this.$modal.onclick = this.cancel.bind(this);
		this.$okBtn.onclick = this.ok.bind(this);
	}
	showModal(){
		this.$modal.classList.remove('hide');
	}
	ok() {
		const value = this.$input.value;
		if(!this.validate(value)) {
			console.log('Имя не должно быть пустым.');
			return;
		}
		this.$input.value = '';
		this.$modal.classList.add('hide');
		this.okHandler(value);
	}
	cancel(e){
		if(!e.target.classList.contains('cancel') && e.target.closest('.content'))
			return;
		this.$input.value = '';
		this.$modal.classList.add('hide');
		this.cancelHandler();
	}
	validate(value) {
		return value !== ''
	}
}
class ScoreTable {
	constructor(domHelper) {
		this.domHelper = domHelper;
		this.currentScore = 0;
		this.modal = new Modal(this.saveHandler.bind(this),	this.cancelHandler.bind(this),);
	}
	init() {
		this.domHelper.renderTopScores(this.getTopScores());
	}
	gameEnded(score) {
		this.currentScore = score;
		this.modal.showModal();
	}
	saveHandler(name) {
		if(this.currentScore === 0)
			return;
		let topScores = this.getTopScores();
		topScores.push({ name, score: this.currentScore});
		this.currentScore = 0;
		topScores.sort((a, b) => {
			return +a.score < +b.score;
		});
		topScores = topScores.slice(0, 10);
		this.domHelper.renderTopScores(topScores);
		this.saveTopScores(topScores);
	}

	cancelHandler(){console.log('canceled');}
	getTopScores() {
		return JSON.parse(window.localStorage.getItem('topScores')) || [];
	}
	saveTopScores(scores) {
		window.localStorage.setItem('topScores', JSON.stringify(scores));
	}

}
class Game {
	constructor(
			{COLORS = ['blue'], START_ACTIVE_CELLS = 3, MAX_PAINTED_CELLS = 2},
			domHelperOptions,
			timerControlOptions,
			) {
		this.COLORS = COLORS;
		this.START_ACTIVE_CELLS = START_ACTIVE_CELLS;
		this.MAX_PAINTED_CELLS = MAX_PAINTED_CELLS;
		this.painted = 0;
		this.currentScore = 0;
		this.isRunning = false;
		this.domHelper = new DOMHelper(domHelperOptions);
		this.timerControl = new TimerControl(timerControlOptions, this.domHelper);
		this.scoreTable = new ScoreTable (this.domHelper);
		this.init();
	}
	init () {
		this.scoreTable.init();
		this.domHelper.init(
			this.pauseHandler.bind(this),
			this.startGame.bind(this),
			this.clickHandler.bind(this),
		);
	}
	pauseHandler() {
		this.isRunning ? this.pauseGame() : this.resumeGame();
		this.domHelper.changeMode(this.isRunning);
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
		this.domHelper.setScore(++this.currentScore);
		cell.dataset.status === 'clear';
		cell.style.backgroundColor = '';
		this.paintRandomCells();
	}
	startGame() {
		this.clearGame();
		this.domHelper.startGame();
		this.paintRandomCells();
		this.resumeGame(true);
	}
	pauseGame() {
		this.timerControl.stop();
		this.domHelper.pauseGame();
		this.isRunning = false;
	}

	resumeGame(isStart) {
		this.timerControl.resume(this.endGame.bind(this), isStart);
		this.domHelper.resumeGame();
		this.isRunning = true;
	}
	endGame() {
		this.timerControl.stop();
		this.domHelper.endGame();
		this.scoreTable.gameEnded(this.currentScore);
		this.isRunning = false;
	}
	clearGame() {
		this.domHelper.clearGame();
		this.currentScore = 0;
		this.painted = 0;
	}
	paintRandomCells() {
		const count = this.painted ? getRandom(0, this.MAX_PAINTED_CELLS) : this.START_ACTIVE_CELLS;
		for(let i = 0; i < count; i++){
			while(true){
				const candidate = this.domHelper.getRandomCell();
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

const game = new Game ({
	COLORS: [ 'red', 'blue'],
	START_ACTIVE_CELLS: 3,
	MAX_PAINTED_CELLS: 2,
}, {
	ROW_MAX: 30,
	COL_MAX: 20,
	pause: '.start-btn',
	newGame: '.new-game-btn',
	scoreIndicator: '.current-score',
	timeCounter: '.time-counter',
	gameField: '.game-field',
	blur: '.blur',
	scoresList: '.scores-list',
}, {
	GAME_TIME: 2000,
	REFRESH_TIME: 400,
});
