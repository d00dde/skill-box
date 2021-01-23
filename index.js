const app = require('./init');
const { serverError, noFound } = require('./responses/error.responses');

app.use('/', require('./routes/auth.router'));
app.use('/register', require('./routes/register.router'));
app.use('/results', require('./routes/results.router'));
app.use('/user', require('./routes/user.router'));
app.use('/admin', require('./routes/admin.router'));

app.get('*', (_, res) => noFound(res));
app.use((err, _, res, next) => serverError(err, res));
