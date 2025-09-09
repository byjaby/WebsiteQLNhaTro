const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"],
    },

    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: ["nguoi_thue", "chu_tro"],
      default: "nguoi_thue",
    },

    soDienThoai: {
      type: String,
      required: [true, "Số điện thoại không được để trống"],
      unique: true, // unique toàn hệ thống
      match: [/^0[0-9]{8,10}$/, "Số điện thoại không hợp lệ"], // 9-11 số, bắt đầu bằng 0
    },

    // Thông tin dành cho NGƯỜI THUÊ
    diaChiNguoiThue: {
      type: String,
      required: function () {
        return this.role === "nguoi_thue";
      },
    },

    // Thông tin dành cho CHỦ TRỌ
    tenTro: {
      type: String,
      required: function () {
        return this.role === "chu_tro";
      },
    },
    diaChiNhaTro: {
      type: String,
      required: function () {
        return this.role === "chu_tro";
      },
      unique: true, // mỗi địa chỉ trọ là duy nhất (nhưng chỉ check ở chủ trọ)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
