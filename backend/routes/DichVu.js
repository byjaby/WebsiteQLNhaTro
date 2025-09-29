const express = require("express");
const router = express.Router();
const DichVu = require("../models/DichVu");
const mongoose = require("mongoose");

// Lấy danh sách dịch vụ theo chủ trọ
router.get("/:chuTroId", async (req, res) => {
  try {
    const chuTroId = new mongoose.Types.ObjectId(req.params.chuTroId);
    const dichVuList = await DichVu.find({ chuTroId });
    res.json(dichVuList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { tenDichVu, donVi, donGia, moTa, chuTroId } = req.body;

    if (!tenDichVu || !donVi || donGia == null || !chuTroId) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }

    const newDichVu = new DichVu({
      tenDichVu,
      donVi,
      donGia,
      moTa,
      chuTroId,
    });

    const saved = await newDichVu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật dịch vụ
router.put("/:id", async (req, res) => {
  try {
    const dichVu = await DichVu.findById(req.params.id);
    if (!dichVu)
      return res.status(404).json({ error: "Không tìm thấy dịch vụ" });

    // Nếu là dịch vụ mặc định thì không cho đổi tên, nhưng vẫn cho update các field khác
    if (dichVu.tenDichVu === "Điện" || dichVu.tenDichVu === "Nước") {
      // Ghi đè lại tên gốc, để tránh client cố tình gửi lên tên mới
      req.body.tenDichVu = dichVu.tenDichVu;
    }

    const updated = await DichVu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa dịch vụ
router.delete("/:id", async (req, res) => {
  try {
    const dichVu = await DichVu.findById(req.params.id);
    if (!dichVu)
      return res.status(404).json({ error: "Không tìm thấy dịch vụ" });

    await DichVu.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
