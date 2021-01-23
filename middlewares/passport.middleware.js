const passport = require('passport');
const { authorizationFail } = require('../responses/auth.responses');

module.exports.localAuth = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return authorizationFail(res, info.message);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};
