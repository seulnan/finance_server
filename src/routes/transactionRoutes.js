const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sortOption = "Latest", category = "All" } =
      req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    // 정렬 옵션 매핑
    const sortOptions = {
      Latest: { date: -1 }, // 최신순
      Oldest: { date: 1 }, // 오래된순
      "A to Z": { name: 1 }, // 이름 오름차순
      "Z to A": { name: -1 }, // 이름 내림차순
      Highest: { amount: -1 }, // 금액 높은 순
      Lowest: { amount: 1 }, // 금액 낮은 순
    };

    // 정렬 기준 설정
    const sort = sortOptions[sortOption] || sortOptions["Latest"];

    // 카테고리 필터 설정
    const filter = category !== "All" ? { category } : {};

    // 필터링된 총 문서 수 계산
    const total = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(total / parsedLimit);

    // 요청한 페이지가 총 페이지 수보다 큰 경우 처리
    if (parsedPage > totalPages && totalPages > 0) {
      return res.status(200).json({
        total,
        page: totalPages, // 마지막 유효 페이지 반환
        totalPages,
        transactions: [], // 빈 배열 반환
        message: "No more data available",
      });
    }

    // 데이터 가져오기 (필터 + 정렬 + 페이지네이션)
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit);

    // 소수점 두 자리를 유지하도록 변환
    const transformedTransactions = transactions.map((transaction) => ({
      ...transaction._doc,
      amount: transaction.amount.toFixed(2),
    }));

    res.status(200).json({
      total,
      page: parsedPage,
      totalPages,
      transactions: transformedTransactions,
    });
  } catch (error) {
    console.error("Error occurred:", error.message); // 디버깅용 에러 메시지
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;