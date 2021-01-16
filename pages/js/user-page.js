const $back = document.querySelector('.back');
const $logoutButton = document.querySelector('.logout');
$back.onclick = () => {
  window.location.replace(window.location.origin);
};
$logoutButton.onclick = async () => {
  const response = await fetch(window.location.origin + '/logout', {
    method: 'POST',
  });
  if (response.status === 200) {
    return window.location.replace(window.location.origin);
  }
  const data = await response.json();
  console.log(data.message);
};
