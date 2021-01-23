module.exports = {
  registerSuccess: (res) => {
    return res.status(200).send({ message: 'Registration successful' });
  },
  registerDataFail: (res) => {
    return res.status(400).send({ message: 'Invalid register data' });
  },
  userExistFail: (res) => {
    return res.status(409).send({ message: 'This user already exist' });
  },
  loginIsFree: (res) => {
    return res.status(200).send({ isFree: true });
  },
  loginIsBusy: (res) => {
    return res.status(200).send({ isFree: false });
  },
};
