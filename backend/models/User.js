const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên"],
      trim: true,
    },
    avatar: { type: String, default: "" },
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
      required: function () {
        return !this.googleId; // Nếu không có googleId thì bắt buộc password
      },
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // cho phép nhiều user thường có googleId = null
    },

    role: {
      type: String,
      enum: ["nguoi_thue", "chu_tro"],
      default: "nguoi_thue",
    },

    soDienThoai: {
      type: String,
      required: function () {
        return !this.googleId; // nếu login Google thì không bắt buộc
      },
      unique: true,
      sparse: true, // tránh lỗi unique khi để trống
      match: [/^0[0-9]{8,10}$/, "Số điện thoại không hợp lệ"],
    },

    ngaySinh: {
      type: Date,
      validate: {
        validator: function (value) {
          return value < new Date(); // phải nhỏ hơn ngày hiện tại
        },
        message: "Ngày sinh phải nhỏ hơn ngày hiện tại",
      },
    },

    // Thông tin dành cho NGƯỜI THUÊ
    diaChi: {
      type: String,
      required: function () {
        return this.role === "nguoi_thue" && !this.googleId;
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
    },
    soPhong: {
      type: Number,
      default: 0, // ban đầu chủ trọ chưa có phòng nào
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
