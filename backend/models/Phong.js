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
});

module.exports = mongoose.model("Phong", phongSchema);
