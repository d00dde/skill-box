const maxAge = 3600000;
module.exports = {
  isAuth: (req) => {
    if (req.cookies.auth === '42') return true;
    return false;
  },
  login: (res, name) => {
    res.cookie('auth', '42', {
      maxAge,
    });
    res.cookie('name', name, {
      maxAge,
    });
  },
  logout: (res) => {
    res.clearCookie('auth');
    res.clearCookie('name');
  },
};
