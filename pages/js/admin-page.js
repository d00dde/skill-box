const $login = document.querySelector('.login');
const $name = document.querySelector('.name');
const $searchBtn = document.querySelector('.search');
const $sortGames = document.querySelector('.sort-games');
const $sortTopScores = document.querySelector('.sort-top-scores');
const $limit = document.querySelector('.limit').querySelector('input');
const $table = document.querySelector('.table');
const $fill = document.querySelector('.fill');

let gamesDirection = +$sortGames.dataset.value;
let topScoresDirection = +$sortTopScores.dataset.value;
const totalUsers = +$limit.dataset.users;
const offset = +$limit.dataset.offset;

createPagination(totalUsers, offset, +$limit.value);

$sortGames.innerHTML =
  gamesDirection == 0 ? '&#8212' : gamesDirection == 1 ? '&#x2191' : '&#8595';
$sortTopScores.innerHTML =
  topScoresDirection == 0
    ? '&#8212'
    : topScoresDirection == 1
    ? '&#x2191'
    : '&#8595';

$searchBtn.onclick = () => {
  sendRequest(0);
};

$sortGames.onclick = () => {
  gamesDirection = switchDirection($sortGames, gamesDirection);
};
$sortTopScores.onclick = () => {
  topScoresDirection = switchDirection($sortTopScores, topScoresDirection);
};
$fill.onclick = () => {
  fetch(window.location.origin + '/admin/fill', { method: 'POST' });
};
$table.onclick = (e) => {
  if (!e.target.classList.contains('set-admin')) return;
  fetch(window.location.origin + '/admin/setAdmin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: e.target.dataset.id,
    }),
  });
};

function switchDirection(element, direction) {
  switch (direction) {
    case 0:
      element.innerHTML = '&#x2191';
      return 1;
    case 1:
      element.innerHTML = '&#8595';
      return -1;
    case -1:
      element.innerHTML = '&#8212';
      return 0;
  }
}

function createPagination(total, offset, limit) {
  const pages = Math.ceil(total / limit);
  if (pages === 1) return;
  const wrapper = document.querySelector('.pagination');
  const currentPage = Math.floor(offset / limit);
  for (let i = 0; i < pages; i++) {
    const button = document.createElement('div');
    button.classList.add('page-number');
    button.classList.add('btn');
    if (currentPage === i) {
      button.classList.add('btn-danger');
    } else {
      button.classList.add('btn-outline-danger');
    }
    button.dataset.page = i;
    button.innerText = i + 1;
    wrapper.appendChild(button);
  }
  wrapper.onclick = (e) => {
    if (!e.target.classList.contains('page-number')) return;
    sendRequest(e.target.dataset.page * limit);
  };
}

function sendRequest(offset) {
  const search = `?login=${$login.value}&name=${$name.value}&gamesDirection=${gamesDirection}&topScoresDirection=${topScoresDirection}`;
  const pagination = `&offset=${offset}&limit=${$limit.value}`;
  const url = window.location.origin + '/admin' + search + pagination;
  window.location.replace(url);
}
