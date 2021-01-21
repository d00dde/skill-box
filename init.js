const express = require('express');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const { PORT, mongoUri, secret, maxAge } = require('./config');
const noAuth = require('./middlewares/no-auth.middleware');
// const bureaucrat = require('./middlewares/bureaucrat.middleware');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.use(noAuth);
// app.use(bureaucrat(1000));
app.use(
  session({
    secret,
    cookie: {
      maxAge,
    },
  }),
);
app.set('views', path.join(__dirname, 'pages/views'));
app.set('view engine', 'pug');

(async function () {
  try {
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () =>
      console.log(`App listening at http://localhost:${PORT} ...`),
    );
  } catch (e) {
    console.log('Server error:', e.message);
    process.exit(1);
  }
})();

module.exports = app;
