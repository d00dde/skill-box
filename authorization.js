const maxAge = 3600000;
module.exports = {
  isAuth: (req) => !!req.cookies.login,
  getLogin: (req) => req.cookies.login,
  logIn: (res, name, login) => {
    res.cookie('name', name, {
      maxAge,
    });
    res.cookie('login', login, {
      maxAge,
    });
  },
  logout: (res) => {
    res.clearCookie('name');
    res.clearCookie('login');
  },
};
