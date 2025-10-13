// models/Phong.js
const mongoose = require("mongoose");

const phongSchema = new mongoose.Schema({
  tenPhong: { type: String, required: true },
  chieuDai: { type: Number, required: true },
  chieuRong: { type: Number, required: true },
  soNguoiToiDa: { type: Number, required: true },
  tienPhong: { type: Number, required: true },
  trangThai: { type: String, default: "Trống" },
  chuTroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [String], // Mảng các URL hình ảnh
  coverImage: { type: String, default: "" }, // URL hình ảnh bìa
  ngayTao: { type: Date, default: Date.now }, // ✅ Thêm dòng này
});

module.exports = mongoose.model("Phong", phongSchema);
