const mongoose = require('mongoose');

const PotSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    target: { type: Number, required: true },
    currentAmount: { type: Number, required: true },
    color: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Pot', PotSchema);
