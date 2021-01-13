const url = window.location.origin + '/login';

const $form = document.querySelector('form');
const $email = document.querySelector('.email');
const $password = document.querySelector('.password');
const $message = document.querySelector('.message');

$form.onsubmit = async (e) => {
  e.preventDefault();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: $email.value,
      password: $password.value,
    }),
  });
  if (response.status === 200) {
    return window.location.replace(window.location.origin + '/game');
  }
  const data = await response.json();
  $message.textContent = data.message;
};
