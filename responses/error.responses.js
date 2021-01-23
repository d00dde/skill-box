module.exports = {
  serverError: (err, res) => {
    console.log(err);
    return res.status(500).send({ message: 'Terrible server error' });
  },
  noFound: (res) => {
    return res.status(404).render('no-found');
  },
};
