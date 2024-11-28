const mongoose = require('mongoose');

const PotSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  target: { type: Number, required: true },
  total: { type: Number, required: true },
  theme: { type: String, required: true },
});

module.exports = mongoose.model('Pot', PotSchema);
