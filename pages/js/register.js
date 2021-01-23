const url = window.location.origin + '/register';

const $form = document.querySelector('form');
const $login = document.querySelector('.login');
const $name = document.querySelector('.name');
const $password = document.querySelector('.password');
const $confirmPassword = document.querySelector('.confirm-password');
const $message = document.querySelector('.message');
const $checkBtn = document.querySelector('.check');
const $checkImg = document.querySelector('.check-img');

$form.onsubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    $password.value = '';
    $confirmPassword.value = '';
    return;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: $login.value,
      password: $password.value,
      name: $name.value,
    }),
  });
  if (response.status === 200) {
    return window.location.replace(window.location.origin + '/game');
  }
  const data = await response.json();
  $message.textContent = data.message;
  $password.value = '';
  $confirmPassword.value = '';
};
$checkBtn.onclick = async () => {
  $checkImg.dataset.free = '';
  $message.textContent = '';
  if (!validateLogin($login.value)) {
    return ($message.textContent = 'Введите валидный login');
  }
  const response = await fetch(url + '/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: $login.value,
    }),
  });
  if (response.status !== 200) {
    return ($message.textContent = 'Ошибка запроса, повторите попытку');
  }
  const data = await response.json();
  if (data.isFree) {
    $checkImg.dataset.free = 'yes';
  } else {
    $checkImg.dataset.free = 'no';
  }
};
function validateForm() {
  $message.textContent = '';
  if (!validateLogin($login.value)) {
    $message.textContent = 'Введите валидный login';
    return false;
  }
  if (!validateName($name.value)) {
    $message.textContent = 'Введите валидное имя';
    return false;
  }
  if (!validatePassword($password.value)) {
    $message.textContent = 'Пароль не должен быть короче 8 символов';
    return false;
  }
  if ($password.value !== $confirmPassword.value) {
    $message.textContent = 'Пароли должны совпадать';
    return false;
  }
  return true;
}

function validateLogin(login) {
  return login.match(/[a-z0-9]/g).join('') === login;
}
function validatePassword(password) {
  return password.length > 7;
}
function validateName(name) {
  return name.match(/[a-z0-9а-я ]/gi).join('') === name;
}
