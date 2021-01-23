module.exports = {
  loginSuccess: (res) => {
    return res.status(200).send({ message: 'Authorization successful' });
  },
  logoutSuccess: (res) => {
    return res.status(200).send({ message: 'Logout successful' });
  },
  authorizationFail: (res) => {
    return res.status(400).send({ message: 'Invalid login or password' });
  },
};
