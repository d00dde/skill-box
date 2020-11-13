const GAME_TIME = 10000;
const REFRESH_TIME = 100;
const ROW_MAX = 30;
const COL_MAX = 20;
const COLORS = [ 'red', 'blue'];
const START_ACTIVE_CELLS = 3;
const MAX_PAINTED_CELLS = 2;

function setCSS (css) {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
}
function getRandom(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


const startBtn = document.querySelector('.start');
const newGameBtn = document.querySelector('.new-game');
const scoreIndicator = document.querySelector('.current-score');
const timeCounter = document.querySelector('.time-counter');

init();
let painted = 0;
let currentScore = 0;
let startTime = 0;
let endTime = 0;
let timeLeft = 0;
let timer = 0;
let ticInterval = 0;
let isRunning = false;

const cells = document.querySelectorAll('.cell');

class Game {
	constructor() {}

}

function init () {
	startBtn.onclick = startHandler;
	startBtn.dataset.status = 'play';
	newGameBtn.onclick = newGameHandler;
	createField();
}

function newGameHandler() {
	newGameBtn.disabled = true;
	startBtn.disabled = false;
	startGame();
}

function startGame() {
	currentScore = 0;
	scoreIndicator.innerText = 0;
	painted = 0;
	cells.forEach((cell) => {
		cell.dataset.status = 'clear';
		cell.style.backgroundColor = '';
	});
	paintRandomCells();
	resumeGame(GAME_TIME);
}

function pauseGame() {
	timeLeft = endTime - Date.now();
	isRunning = false;
	clearTimeout(gameTimer);
	clearInterval(ticInterval);
}

function resumeGame(timeLeft) {
	startTime = Date.now();
	isRunning = true;
	endTime = startTime + timeLeft;
	gameTimer = setTimeout(() => {
		stopGame();
	}, timeLeft);
	ticInterval = setInterval (() => {
		const toEnd  = endTime - Date.now();
		timeCounter.innerText = Math.round(toEnd/1000);
	}, REFRESH_TIME);
}

function stopGame() {
	clearTimeout(gameTimer);
	clearInterval(ticInterval);
	isRunning = false;
	newGameBtn.disabled = false;
	startBtn.disabled = true;
	startBtn.innerText = 'Пауза';

}

function startHandler() {
	if(startBtn.dataset.status === 'play') {
		startBtn.innerText = 'Старт';
		startBtn.dataset.status = 'paused';
		pauseGame();
	} else {
		startBtn.innerText = 'Пауза';
		startBtn.dataset.status = 'play';
		resumeGame(timeLeft);
	}
}

function paintRandomCells() {
	const count = painted ? getRandom(0, MAX_PAINTED_CELLS) : START_ACTIVE_CELLS;
	for(let i = 0; i < count; i++){
		while(true){
			const candidate = cells[getRandom(0, cells.length-1)];
			if(candidate.dataset.status === 'clear'){
				candidate.style.backgroundColor = COLORS[getRandom(0, COLORS.length-1)];
				painted++;
				candidate.dataset.status = 'paint';
				break;
			}
		}
	}
}

function createField () {
	const gameField = document.querySelector('.game-field');
	gameField.innerHTML = '';
	const style = window.getComputedStyle(gameField);
	setCSS (
		`.cell {
			width: ${Math.floor(parseInt(style.width))/COL_MAX}px;
			height: ${Math.floor(parseInt(style.height))/ROW_MAX}px;
		}`);

	let number = 0;
	for(let i = 0; i < ROW_MAX; i++) {
		for(let j = 0; j < COL_MAX; j++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset.id = number++;
			cell.dataset.status = 'clear';
			// cell.textContent = number - 1;
			gameField.appendChild(cell);
		}
	}
	gameField.onclick = (e) => {
		if(!isRunning)
			return;
		if(!e.target.classList.contains('cell'))
			return;
		const cell = e.target;
		if(!(cell.dataset.status === 'paint'))
			return;
		painted--;
		scoreIndicator.innerText = ++currentScore;
		cell.dataset.status === 'clear';
		cell.style.backgroundColor = '';
		paintRandomCells();
	}
}
