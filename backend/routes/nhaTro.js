// routes/nhaTro.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Phong = require("../models/Phong");

// Lấy danh sách nhà trọ
router.get("/", async (req, res) => {
  try {
    // Lấy tất cả chủ trọ
    const chuTros = await User.find({ role: "chu_tro" });

    // Lấy thêm min/max giá phòng
    const result = await Promise.all(
      chuTros.map(async (chuTro) => {
        const phongStats = await Phong.aggregate([
          { $match: { chuTroId: chuTro._id } },
          {
            $group: {
              _id: null,
              minGia: { $min: "$tienPhong" },
              maxGia: { $max: "$tienPhong" },
              tongPhong: { $sum: 1 },
              phongTrong: {
                $sum: { $cond: [{ $eq: ["$trangThai", "Trống"] }, 1, 0] },
              },
            },
          },
        ]);

        const stats = phongStats[0] || {
          minGia: 0,
          maxGia: 0,
          tongPhong: chuTro.soPhong,
          phongTrong: 0,
        };

        return {
          id: chuTro._id,
          chuTro: chuTro.name,
          tenTro: chuTro.tenTro,
          diaChi: chuTro.diaChiNhaTro,
          soPhong: chuTro.soPhong,
          minGia: stats.minGia,
          maxGia: stats.maxGia,
          phongTrong: stats.phongTrong,
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
