const $searchBtn = document.querySelector('.search');
const $login = document.querySelector('.login');
const $name = document.querySelector('.name');

$searchBtn.onclick = () => {
  const search = `?login=${$login.value}&name=${$name.value}`;
  const url = window.location.origin + '/admin' + search;
  window.location.replace(url);
};
