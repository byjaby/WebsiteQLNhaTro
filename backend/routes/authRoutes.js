const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DichVu = require("../models/DichVu");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========== ĐĂNG KÝ ==========
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      tenTro,
      diaChiNhaTro,
      diaChiNguoiThue,
      soDienThoai,
    } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Kiểm tra số điện thoại tồn tại
    const existingPhone = await User.findOne({ soDienThoai });
    if (existingPhone) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }
    const existingAddress = await User.findOne({ diaChiNhaTro });
    if (existingAddress) {
      return res
        .status(400)
        .json({ message: "Địa chỉ nhà trọ đã được sử dụng" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "nguoi_thue",
      soDienThoai,
      tenTro: role === "chu_tro" ? tenTro : undefined,
      diaChiNhaTro: role === "chu_tro" ? diaChiNhaTro : undefined,
      diaChiNguoiThue: role === "nguoi_thue" ? diaChiNguoiThue : undefined,
    });

    const savedUser = await newUser.save();

    if (savedUser.role === "chu_tro") {
      try {
        await DichVu.insertMany([
          {
            tenDichVu: "Điện",
            donVi: "kWh",
            donGia: null,
            moTa: "",
            chuTroId: savedUser.id,
          },
          {
            tenDichVu: "Nước",
            donVi: "m3",
            donGia: null,
            moTa: "",
            chuTroId: savedUser.id,
          },
        ]);
        console.log(
          "Tạo dịch vụ mặc định thành công cho chủ trọ:",
          savedUser.id
        );
      } catch (err) {
        console.error("Không thể tạo dịch vụ mặc định:", err);
      }
    }

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Register error:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Giá trị đã tồn tại",
        field: Object.keys(error.keyValue)[0],
      });
    }

    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// ========== ĐĂNG NHẬP ==========
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenTro: user.tenTro,
        diaChi: user.diaChi,
        soDienThoai: user.soDienThoai,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ========== LẤY USER HIỆN TẠI ==========
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
