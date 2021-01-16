const app = require('./init');

app.use('/', require('./routes/auth.router'));
app.use('/register', require('./routes/register.router'));
app.use('/results', require('./routes/results.router'));
app.use('/user', require('./routes/user.router'));

app.get('*', (_, res) => {
  res.status(404).render('no-found');
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Terrible server error' });
});
