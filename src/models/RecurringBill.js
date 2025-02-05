const mongoose = require('mongoose');

const RecurringBillSchema = new mongoose.Schema(
  {
    avatar: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }, // Monthly 2nd, Monthly 5th 형식
    amount: { type: Number, required: true },
  },
  { versionKey: false } // __v 제거
);

module.exports = mongoose.model('RecurringBill', RecurringBillSchema, 'recurringBills');