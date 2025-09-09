const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Ví dụ API lấy danh sách items (cần login)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Ở đây bạn có thể lấy dữ liệu từ DB
    res.json({
      message: "Lấy danh sách items thành công",
      userId: req.user.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
