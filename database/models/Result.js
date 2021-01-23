const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  gameDate: { type: Date, required: true },
});

module.exports = model('Result', schema);
