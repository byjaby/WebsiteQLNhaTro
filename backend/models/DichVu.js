const mongoose = require("mongoose");

const dichVuSchema = new mongoose.Schema({
  tenDichVu: { type: String, required: true },
  donVi: { type: String, required: true },
  donGia: { type: Number, default: null },
  moTa: { type: String, default: "" },
  chuTroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("DichVu", dichVuSchema);
