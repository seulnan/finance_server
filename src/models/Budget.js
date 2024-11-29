const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  color: { type: String, unique: true, required: true },
  limit: { type: Number, required: true },
  used: { type: Number, default: 0 },
  },{ versionKey: false } 
);

module.exports = mongoose.model('Budget', BudgetSchema);
