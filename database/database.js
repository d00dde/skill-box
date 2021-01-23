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
      role: 'gamer',
      name,
      regIp,
      regDate: new Date(),
      topScore: 0,
      totalGames: 0,
    });
    await user.save();
    return user;
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
    user.totalGames++;
    if (score > user.topScore) user.topScore = score;
    await user.save();
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
  getUsers: async (
    login,
    name,
    gamesDirection,
    topScoresDirection,
    offset,
    limit,
  ) => {
    const search = [
      { login: { $regex: login, $options: 'i' } },
      { name: { $regex: name, $options: 'i' } },
    ];
    const query = User.find({ $and: search });
    if (+topScoresDirection) query.sort({ topScore: topScoresDirection });
    if (+gamesDirection) query.sort({ totalGames: gamesDirection });
    query.skip(+offset).limit(+limit);
    users = await query;
    return users.map(
      ({ _id, login, name, regIp, regDate, totalGames, topScore }) => {
        return { _id, login, name, regIp, regDate, totalGames, topScore };
      },
    );
  },
  getUsersLength: async (login, name, gamesDirection, topScoresDirection) => {
    const search = [
      { login: { $regex: login, $options: 'i' } },
      { name: { $regex: name, $options: 'i' } },
    ];
    const query = User.find({ $and: search });
    if (+topScoresDirection) query.sort({ topScore: topScoresDirection });
    if (+gamesDirection) query.sort({ totalGames: gamesDirection });
    users = await query;
    return users.length;
  },
  setAdmin: async (_id) => {
    const user = await User.findOne({ _id });
    user.role = 'admin';
    await user.save();
  },

  fillUsers: async () => {
    const hashedPassword = await bcrypt.hash('admin777', 10);
    for (let i = 0; i < 500; i++) {
      const user = new User({
        login: 'adminlogin' + i,
        password: hashedPassword,
        role: 'gamer',
        name: 'John' + i,
        regIp: `${gR(0, 255)}.${gR(0, 255)}.${gR(0, 255)}.${gR(0, 255)}`,
        regDate: new Date(),
        topScore: gR(0, 270),
        totalGames: gR(0, 500),
      });
      await user.save();
    }
  },
};

function gR(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
