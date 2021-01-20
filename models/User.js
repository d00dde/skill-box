const { Schema, model } = require('mongoose');

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  regIp: { type: String, required: true },
  regDate: { type: Date, required: true },
});

module.exports = model('User', schema);
