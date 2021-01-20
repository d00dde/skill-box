const express = require('express');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const path = require('path');
const { PORT, mongoUri } = require('./config');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'pages/views'));
app.set('view engine', 'pug');

(async function () {
  try {
    // mongoose.connect(mongoUri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    // });
    app.listen(PORT, () =>
      console.log(`App listening at http://localhost:${PORT} ...`),
    );
  } catch (e) {
    console.log('Server error:', e.message);
    process.exit(1);
  }
})();

module.exports = app;
