module.exports = {
  dataNoValid: (res) => {
    return res.status(400).send({ message: 'Data is not a valid' });
  },
  scoreSaved: (res) => {
    return res.status(201).send({ message: 'Score saved' });
  },
};
