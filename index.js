const ROW_MAX = 30;
const COL_MAX = 20;
const COLORS = [ 'red', 'blue'];

function setCSS (css) {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
}

function getRandom(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

let painted = 0;
createField();
const cells = document.querySelectorAll('.cell');
paintRandomCells();


function paintRandomCells() {
	const count = painted ? getRandom(0, 2) : 3;
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
			cell.textContent = number - 1;
			gameField.appendChild(cell);
		}
	}
	gameField.onclick = (e) => {
		if(!e.target.classList.contains('cell'))
			return;
		const cell = e.target;
		if(!(cell.dataset.status === 'paint'))
			return;
		painted--;
		cell.dataset.status === 'clear';
		cell.style.backgroundColor = '';
		paintRandomCells();

	}
}
