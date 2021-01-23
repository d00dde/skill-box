const database = require('./database');

const wrapped = {};
Object.keys(database).forEach((method) => {
  wrapped[method] = async (next, ...args) => {
    try {
      return await database[method](...args);
    } catch (err) {
      next(err);
    }
  };
});

module.exports = wrapped;
