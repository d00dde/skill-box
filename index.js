const express = require('express');
var cookieParser = require('cookie-parser');
const path = require('path');
const PORT = require('./config').PORT;
const { isAuth, login, logout } = require('./authorization');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'pages/views'));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
  if (isAuth(req)) {
    return res.redirect('/game');
  }
  res.render('auth');
});
app.get('/game', (req, res) => {
  if (isAuth(req)) {
    return res.render('game');
  }
  return res.redirect('/');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = checkUser(email, password);
  if (user) {
    login(res, user.name);
    return res.status(200).send({ message: 'Authorization successful' });
  }
  return res.status(400).send({ message: 'Invalid login or password' });
});
app.post('/logout', (req, res) => {
  logout(res);
  return res.status(200).send({ message: 'Logout successful' });
});

app.use('/results', require('./routes/results.router'));

app.get('*', (_, res) => {
  res.status(404).render('no-found');
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Terrible server error' });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

function checkUser(email, password) {
  const users = require('./users');
  const user = users.find((item) => item.email === email);
  if (!user) return null;
  if (user.password === password) return user;
  return null;
}
