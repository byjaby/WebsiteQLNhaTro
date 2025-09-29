// routes/phong.js
const express = require("express");
const router = express.Router();
const Phong = require("../models/Phong");
const User = require("../models/User"); // ✅ thêm

// 🏠 Thêm phòng
router.post("/", async (req, res) => {
  try {
    if (!req.body.chuTroId) {
      return res.status(400).json({ error: "Thiếu chuTroId" });
    }

    const newPhong = new Phong(req.body);
    const savedPhong = await newPhong.save();

    // ✅ Cập nhật số phòng của chủ trọ +1
    await User.findByIdAndUpdate(savedPhong.chuTroId, {
      $inc: { soPhong: 1 },
    });

    res.status(201).json(savedPhong);
  } catch (err) {
    console.error("❌ Lỗi khi lưu phòng:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/phong/chu-tro/:chuTroId
router.get("/chu-tro/:chuTroId", async (req, res) => {
  try {
    const rooms = await Phong.find({ chuTroId: req.params.chuTroId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Lấy chi tiết 1 phòng theo id
router.get("/:id", async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id).select("-chuTroId -__v");
    if (!phong)
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    res.json(phong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Cập nhật thông tin phòng
router.put("/:id", async (req, res) => {
  try {
    const updatedPhong = await Phong.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-chuTroId -__v");

    if (!updatedPhong)
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng để cập nhật" });

    res.json({ message: "Cập nhật thành công", phong: updatedPhong });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🗑️ Xóa phòng theo id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Phong.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });
    }

    // ✅ Giảm số phòng của chủ trọ -1
    await User.findByIdAndUpdate(deleted.chuTroId, {
      $inc: { soPhong: -1 },
    });

    return res
      .status(200)
      .json({ message: "Xóa phòng thành công", id: req.params.id });
  } catch (err) {
    console.error("❌ Lỗi khi xóa phòng:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả phòng của 1 chủ trọ
router.get("/tro/:chuTroId", async (req, res) => {
  try {
    const { chuTroId } = req.params;
    const chuTro = await User.findById(chuTroId);
    if (!chuTro)
      return res.status(404).json({ message: "Không tìm thấy chủ trọ" });

    const phongs = await Phong.find({ chuTroId });
    res.json({ chuTro, phongs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
