const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Result = require('./models/Result');

module.exports = {
  checkUser: async (login, password) => {
    const user = await User.findOne({ login });
    if (!user) return null;
    if (await bcrypt.compare(password, user.password)) return user;
    return null;
  },
  getUser: async (login) => await User.findOne({ login }),
  addUser: async (login, password, name, regIp) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      login,
      password: hashedPassword,
      name,
      regIp,
      regDate: new Date(),
    });
    await user.save();
  },
  getTop10: async () => {
    const results = await Result.find({}).sort({ score: -1 }).limit(10);
    return results.map((result) => {
      return { name: result.userName, score: result.score };
    });
  },
  addResult: async (login, score) => {
    const user = await User.findOne({ login });
    const result = new Result({
      userId: user._id,
      userName: user.name,
      score,
      gameDate: new Date(),
    });
    await result.save();
  },
  getUserBest: async (userId) => {
    const results = await Result.find({ userId }).sort({ score: -1 }).limit(1);
    return results[0] ? results[0].score : 0;
  },
  getUserResults: async (userId) => {
    const results = await Result.find({ userId }).sort({ score: -1 });
    return results.map(({ score, gameDate }) => {
      return { score, gameDate };
    });
  },
};
