const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  recurring: { type: Boolean, default: false },
  },
  { versionKey: false } 
);

module.exports = mongoose.model('Transaction', TransactionSchema);