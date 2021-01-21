// Утилиты (pure functions)

function setCSS(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}
function getRandom(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
function formatTime(time) {
  const mins = Math.floor(time / 60);
  let seconds = time - mins * 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${mins}:${seconds}`;
}

// Класс TimerControl отвечает за управление таймерами игры
class TimerControl {
  constructor(
    { GAME_TIME = 60000, REFRESH_TIME = 400 },
    domHelper,
    endCallback,
  ) {
    this.GAME_TIME = GAME_TIME;
    this.REFRESH_TIME = REFRESH_TIME;
    this.startTime = 0;
    this.endTime = 0;
    this.timeLeft = 0;
    this.gameTimer = 0;
    this.ticInterval = 0;
    this.endCallback = endCallback;
    this.domHelper = domHelper;
    this.domHelper.setTimeLeft(GAME_TIME / 1000);
  }
  stop() {
    this.timeLeft = this.endTime - Date.now();
    clearTimeout(this.gameTimer);
    clearInterval(this.ticInterval);
  }
  resume(isStart) {
    isStart ? (this.timeLeft = this.GAME_TIME) : null;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.timeLeft;
    this.gameTimer = setTimeout(() => {
      this.endCallback();
    }, this.timeLeft);
    this.ticInterval = setInterval(() => {
      const toEnd = this.endTime - Date.now();
      this.domHelper.setTimeLeft(Math.round(toEnd / 1000));
    }, this.REFRESH_TIME);
  }
  addTime(time) {
    clearTimeout(this.gameTimer);
    this.endTime += time;
    this.timeLeft = this.endTime - Date.now();
    this.gameTimer = setTimeout(() => {
      this.endCallback();
    }, this.timeLeft);
  }
}

// Класс DOMHelper отвечает за взаимодействие логики игры с элементами DOM
class DOMHelper {
  constructor({
    BLOCK_WIDTH = 20,
    BLOCK_HEIGHT = 20,
    pause,
    newGame,
    scoreIndicator,
    timeCounter,
    gameField,
    blur,
    scoresList,
    typesLegend,
    userTopScore,
  }) {
    this.BLOCK_WIDTH = BLOCK_WIDTH;
    this.BLOCK_HEIGHT = BLOCK_HEIGHT;
    this.$pauseBtn = document.querySelector(pause);
    this.$newGameBtn = document.querySelector(newGame);
    this.$scoreIndicator = document.querySelector(scoreIndicator);
    this.$timeCounter = document.querySelector(timeCounter);
    this.$gameField = document.querySelector(gameField);
    this.$blur = document.querySelector(blur);
    this.$scoresList = document.querySelector(scoresList);
    this.$typesLegend = document.querySelector(typesLegend);
    this.$userTopScore = document.querySelector(userTopScore);
    this.$cells = null;
  }
  init(pauseHandler, newGameHandler, clickHandler) {
    this.$pauseBtn.onclick = pauseHandler;
    this.$newGameBtn.onclick = newGameHandler;
    this.$gameField.onclick = clickHandler;
    this.$pauseBtn.disabled = true;
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
  toggleMode(isRunning) {
    if (isRunning) {
      this.$pauseBtn.innerText = 'Пауза';
    } else {
      this.$pauseBtn.innerText = 'Старт';
    }
  }
  setScore(score) {
    this.$scoreIndicator.innerText = score;
  }
  setTimeLeft(timeLeft) {
    this.$timeCounter.innerText = formatTime(timeLeft);
  }

  createField() {
    this.$gameField.innerHTML = '';
    const style = window.getComputedStyle(this.$gameField);
    const cols = Math.floor(parseInt(style.width) / this.BLOCK_WIDTH);
    const rows = Math.floor(parseInt(style.height) / this.BLOCK_HEIGHT);
    setCSS(`
		.cell{
			width: ${this.BLOCK_WIDTH}px;
			height: ${this.BLOCK_HEIGHT}px;
		}
		`);
    let number = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.id = number++;
        cell.dataset.status = 'clear';
        this.$gameField.appendChild(cell);
      }
    }
  }
  getRandomCell() {
    return this.$cells[getRandom(0, this.$cells.length - 1)];
  }
  renderTopScores({ top10, best }) {
    this.setUserBest(best);
    if (!top10.length) {
      this.$scoresList.innerHTML = 'Чемпионов пока нет, можешь стать первым';
      return;
    }
    this.$scoresList.innerHTML = '';
    const content = top10
      .map((item) => {
        return `
				<li>
					<span class="name">${item.name}</span>
					<span class="score">${item.score}</span>
				</li>
			`;
      })
      .join('');
    this.$scoresList.innerHTML = `
		<ul>
			${content}
		</ul>
		`;
  }
  setUserBest(score) {
    this.$userTopScore.innerText = score || '0';
  }
  renderErrorTopScores(message) {
    console.log(message);
    this.$scoresList.innerHTML = 'Не удалось получить список лидеров :(';
  }
  renderLoaderTopScores() {
    this.$scoresList.innerHTML = `
		<div class="lds-ripple">
			<div></div>
			<div></div>
		</div>
		`;
  }
  renderTypesLegend(types, getColor) {
    const content = Object.keys(types)
      .map((key) => {
        return `
				<li>
					${types[key].description}
				</li>
			`;
      })
      .join('');
    this.$typesLegend.innerHTML = content;
    let counter = 1;
    const styles = Object.keys(types)
      .map((key) => {
        return `
				.types-legend li:nth-child(${counter++}):before {
					position: absolute;
					content: '';
					top: 50%;
					transform: translateY(-50%);
					left: -5px;
					display: block;
					width: ${this.BLOCK_WIDTH}px;
					height: ${this.BLOCK_HEIGHT}px;
					background-color: ${getColor(types[key])};
				}
			`;
      })
      .join('');
    setCSS(styles);
  }
}

// Класс Modal отвечает за отрисовку и реализацию логики работы модального окна
class Modal {
  constructor(okHandler, cancelHandler) {
    this.$modal = document.querySelector('.modal');
    // this.$input = this.$modal.querySelector('input');
    this.$okBtn = this.$modal.querySelector('.save');
    this.$cancelBtn = this.$modal.querySelector('.cancel');
    this.$score = this.$modal.querySelector('.score');
    this.$message = this.$modal.querySelector('.message');
    this.okHandler = okHandler;
    this.cancelHandler = cancelHandler;
    this.$modal.onclick = this.cancel.bind(this); // Модальное окно закрывается при клике на затемнённую область.
    this.$okBtn.onclick = this.ok.bind(this);
  }
  showModal(score) {
    this.$score.innerText = score;
    this.$modal.classList.remove('hide');
  }
  hideModal() {
    // this.$input.value = '';
    this.$score.innerText = '';
    this.$message.innerHTML = '';
    this.$okBtn.disabled = false;
    this.$cancelBtn.disabled = false;
    this.$modal.classList.add('hide');
  }
  async ok() {
    // const value = this.$input.value;
    // if (!this.validate(value)) {
    //   console.log('Имя не должно быть пустым.'); // Ошибка ввода пользователем имени не обрабатывается.
    //   return;
    // }
    this.$message.innerHTML = `
		<div class="lds-ripple">
			<div></div>
			<div></div>
		</div>
		`;
    this.$okBtn.disabled = true;
    this.$cancelBtn.disabled = true;
    const response = await this.okHandler();
    if (response.ok) {
      this.hideModal();
      return;
    }
    this.$message.innerHTML = 'Не удалось сохранить результат :(';
    this.$okBtn.disabled = false;
    this.$cancelBtn.disabled = false;
    console.log(response.message);
  }
  cancel(e) {
    if (!e.target.classList.contains('cancel') && e.target.closest('.content'))
      return;
    this.hideModal();
    this.cancelHandler();
  }
  validate(value) {
    // Используется простая валидация введённого имени: имя не должно быть пустой строкой
    return value !== '';
  }
}

// Класс ScoreTable отвечает за логику работы таблицы рекордов и сохранение её
class ScoreTable {
  constructor(domHelper) {
    this.domHelper = domHelper;
    this.currentScore = 0;
    this.modal = new Modal(
      this.saveHandler.bind(this),
      this.cancelHandler.bind(this),
    );
    this.scoreUrl = window.location.origin + '/results';
    this.init();
  }
  init() {
    this.getTopScores();
  }
  gameEnded(score) {
    this.currentScore = score;
    this.modal.showModal(score);
  }
  async saveHandler() {
    if (this.currentScore === 0)
      // Нулевой счёт не записывается в таблицу рекордов.
      return;
    const response = await this.saveTopScores(
      this.domHelper.userName,
      this.currentScore,
    );
    if (response.ok) {
      this.getTopScores();
    }
    return response;
  }

  cancelHandler() {
    console.log('canceled');
  } // Отмена сохранения счёта не обрабатывается.
  async getTopScores() {
    this.domHelper.renderLoaderTopScores();
    try {
      const response = await fetch(this.scoreUrl);
      if (response.ok) {
        const data = await response.json();
        this.domHelper.renderTopScores(data);
      } else {
        this.domHelper.renderErrorTopScores(response.statusText);
      }
    } catch (e) {
      this.domHelper.renderErrorTopScores(e.message);
    }
  }
  async saveTopScores(name, score) {
    try {
      const response = await fetch(this.scoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });
      const data = await response.json();
      return {
        ok: response.status === 201,
        message: data.message,
      };
    } catch (e) {
      console.log(e.message);
      return {
        ok: false,
        message: e.message,
      };
    }
  }
}

// Класс Blocks отвечает за логику работы разных типов блоков
class Blocks {
  constructor({ TYPES }, domHelper, timerControl) {
    this.domHelper = domHelper;
    this.timerControl = timerControl;
    this.TYPES = TYPES;
    this.init();
  }
  init() {
    let counter = 0;
    Object.keys(this.TYPES).forEach((key) => {
      const type = this.TYPES[key];
      type.numbers = [];
      for (let i = 0; i < type.weight; i++) {
        type.numbers.push(counter++);
      }
    });
    this.sumWeight = counter;
    this.domHelper.renderTypesLegend(
      this.TYPES,
      this.getDefaultColor.bind(this),
    );
  }
  clickHandler(cell) {
    return this[cell.dataset.type](cell);
  }
  getRandomType() {
    const number = getRandom(0, this.sumWeight - 1);
    return this.TYPES[
      Object.keys(this.TYPES).find((key) =>
        this.TYPES[key].numbers.includes(number),
      )
    ];
  }
  easyRemove(cell) {
    return this.hit(cell, this.TYPES.easyRemove);
  }
  hardRemove(cell) {
    return this.hit(cell, this.TYPES.hardRemove);
  }
  addTime(cell) {
    const isHit = this.hit(cell, this.TYPES.addTime);
    if (isHit) {
      this.timerControl.addTime(this.TYPES.addTime.time);
    }
    return isHit;
  }
  hit(cell, type) {
    if (type.hits === 1) return type.points;
    if (!cell.dataset.hits) {
      cell.dataset.hits = type.hits - 1;
      cell.style.backgroundColor = type.colors[type.hits - 2];
      return false;
    }
    if (cell.dataset.hits > 1) {
      cell.dataset.hits = +cell.dataset.hits - 1;
      cell.style.backgroundColor = type.colors[+cell.dataset.hits - 1];
      return false;
    }
    return type.points;
  }
  getDefaultColor(type) {
    return type.colors[type.colors.length - 1];
  }
}

// Класс Game - основной класс, отвечает за логику игры и использование других классов
class Game {
  constructor(
    { START_ACTIVE_CELLS = 3, MAX_PAINTED_CELLS = 2 },
    domHelperOptions,
    timerControlOptions,
    blocksOptions,
  ) {
    this.START_ACTIVE_CELLS = START_ACTIVE_CELLS;
    this.MAX_PAINTED_CELLS = MAX_PAINTED_CELLS;
    this.painted = 0;
    this.currentScore = 0;
    this.isRunning = false;
    this.domHelper = new DOMHelper(domHelperOptions);
    this.timerControl = new TimerControl(
      timerControlOptions,
      this.domHelper,
      this.endGame.bind(this),
    );
    this.scoreTable = new ScoreTable(this.domHelper);
    this.blocks = new Blocks(blocksOptions, this.domHelper, this.timerControl);
    this.init();
  }
  init() {
    this.domHelper.init(
      this.pauseHandler.bind(this),
      this.startGame.bind(this),
      this.clickHandler.bind(this),
    );
  }
  pauseHandler() {
    this.isRunning ? this.pauseGame() : this.resumeGame();
    this.domHelper.toggleMode(this.isRunning);
  }
  clickHandler(e) {
    if (!this.isRunning) return;
    if (!e.target.classList.contains('cell')) return;
    const cell = e.target;
    if (!(cell.dataset.status === 'paint')) return;
    const points = this.blocks.clickHandler(cell);
    if (points) {
      this.currentScore += points;
      this.domHelper.setScore(this.currentScore);
      cell.dataset.status = 'clear';
      cell.style.backgroundColor = '';
      this.painted--;
      this.paintRandomCells();
    }
  }
  startGame() {
    if (this.isRunning)
      // Нельзя начать новую игру пока текущая игра не окончена.
      return;
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
    this.timerControl.resume(isStart);
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
    const count = this.painted
      ? getRandom(0, this.MAX_PAINTED_CELLS)
      : this.START_ACTIVE_CELLS; // Игра начинается с 3-х блоков. Если в ходе игры игрок уберёт все блоки, то на игровое поле будет добавлено 3 блока. Это можно настроить изменив константу START_ACTIVE_CELLS в опциях.
    for (let i = 0; i < count; i++) {
      while (true) {
        const candidate = this.domHelper.getRandomCell();
        if (candidate.dataset.status === 'clear') {
          const type = this.blocks.getRandomType();
          candidate.style.backgroundColor = this.blocks.getDefaultColor(type);
          candidate.dataset.status = 'paint';
          candidate.dataset.type = type.action;
          this.painted++;
          break;
        }
      }
    }
  }
}

const game = new Game(
  {
    START_ACTIVE_CELLS: 3,
    MAX_PAINTED_CELLS: 2,
  },
  {
    BLOCK_WIDTH: 20,
    BLOCK_HEIGHT: 20,
    pause: '.start-btn',
    newGame: '.new-game-btn',
    scoreIndicator: '.current-score',
    timeCounter: '.time-counter',
    gameField: '.game-field',
    blur: '.blur',
    scoresList: '.scores-list',
    typesLegend: '.types-legend',
    userTopScore: '.user-top-score',
  },
  {
    GAME_TIME: 60000,
    REFRESH_TIME: 400,
  },
  {
    TYPES: {
      easyRemove: {
        colors: ['#1771F1'],
        action: 'easyRemove',
        weight: 3,
        points: 1,
        hits: 1,
        description: 'Убирается 1 кликом, даёт 1 очко',
      },
      addTime: {
        colors: ['#00CF91'],
        action: 'addTime',
        points: 1,
        weight: 1,
        hits: 1,
        time: 2000,
        description: 'Убирается 1 кликом, даёт 1 очко и добавляет время',
      },
      hardRemove: {
        colors: ['#FF6A61', '#EE3D48', '#B40A1B'],
        action: 'hardRemove',
        weight: 1,
        points: 2,
        hits: 3,
        description: 'Убирается 3 кликами, даёт 2 очка',
      },
    },
  },
);
