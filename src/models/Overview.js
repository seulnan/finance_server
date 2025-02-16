const mongoose = require("mongoose");

const OverviewSchema = new mongoose.Schema({
    currentBalance: { type: Number, required: true, default: 0 }, // 총 보유 금액
    income: { type: Number, required: true, default: 0 }, // 총 수입
    expenses: { type: Number, required: true, default: 0 }, // 총 지출
    },
    { versionKey: false }
);

module.exports = mongoose.model("Overview", OverviewSchema);