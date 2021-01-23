const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { checkUser } = require('../database');

passport.serializeUser((user, done) => {
  const sanitizeUser = {
    _id: user._id,
    login: user.login,
    name: user.name,
    role: user.role,
    regIp: user.regIp,
    regDate: user.regDate,
    topScore: user.topScore,
    totalGames: user.totalGames,
  };
  done(null, sanitizeUser);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy(
    { usernameField: 'login' },
    async function (log, pass, done) {
      const { login, password } = sanitize(log, pass);
      const user = await checkUser(done, login, password);
      if (!user) return done(null, false, { message: 'Invalid login data.' });
      return done(null, user);
    },
  ),
);

module.exports = passport;

function sanitize(login, password) {
  return {
    login: login.trim(),
    password,
  };
}
