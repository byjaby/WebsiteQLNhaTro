const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DichVu = require("../models/DichVu");
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra user đã có chưa
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Nếu chưa có thì tạo user mới
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: "nguoi_thue",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Tạo token cho frontend
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Redirect về frontend kèm token
    res.redirect(`http://localhost:3000/dang-nhap?token=${token}`);
  }
);

router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      diaChi,
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
    // Kiểm tra địa chỉ nhà trọ chỉ áp dụng cho chủ trọ
    if (role === "chu_tro" && diaChiNhaTro) {
      const existingAddress = await User.findOne({
        diaChiNhaTro,
        role: "chu_tro",
      });
      if (existingAddress) {
        return res
          .status(400)
          .json({ message: "Địa chỉ nhà trọ đã được sử dụng" });
      }
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "nguoi_thue",
      soDienThoai,
      diaChi: role === "nguoi_thue" ? diaChi : undefined,
      tenTro: role === "chu_tro" ? tenTro : undefined,
      diaChiNhaTro: role === "chu_tro" ? diaChiNhaTro : undefined,
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

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { email, soDienThoai, diaChiNhaTro } = req.body;

    // Kiểm tra email trùng
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
    }

    // Kiểm tra số điện thoại trùng
    if (soDienThoai) {
      const existingPhone = await User.findOne({
        soDienThoai,
        _id: { $ne: req.params.id },
      });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Số điện thoại đã được sử dụng" });
      }
    }

    // Kiểm tra địa chỉ nhà trọ trùng (chỉ cho chu_tro)
    if (diaChiNhaTro) {
      const existingAddress = await User.findOne({
        diaChiNhaTro,
        _id: { $ne: req.params.id },
      });
      if (existingAddress) {
        return res
          .status(400)
          .json({ message: "Địa chỉ nhà trọ đã được sử dụng" });
      }
    }

    // Nếu không trùng thì update
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    // Nếu là lỗi duplicate từ Mongo (E11000)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Giá trị đã tồn tại",
        field: Object.keys(err.keyValue)[0],
      });
    }

    res.status(400).json({ message: err.message });
  }
});

router.put("/change-password/:id", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Mật khẩu mới phải khác mật khẩu hiện tại
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Kiểm tra mật khẩu nhập lại
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Xác nhận mật khẩu không khớp" });
    }

    // Lưu mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//B1: Gửi otp
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy email đã nhập" });
    }

    // Sinh OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu vào DB với hạn 5 phút
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { code: otp, expiresAt },
      { upsert: true, new: true }
    );

    // Gửi mail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true cho 465, false cho 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Quản lý nhà trọ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 5 phút.`,
    });

    res.json({ message: "Mã OTP đã được gửi qua email" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// B2: Người dùng nhập OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "Không tìm thấy OTP" });
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    }

    if (record.code !== otp) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }

    // ✅ Thành công: đánh dấu verified
    record.verified = true;
    await record.save();

    return res.json({ message: "Xác thực OTP thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// B3: Đặt lại mật khẩu
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Xác nhận mật khẩu không khớp" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Cấu hình multer lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatars");

    // Nếu chưa có thư mục thì tạo
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.params.id;

    // Lấy buffer từ file upload
    const avatarBase64 = req.file.buffer.toString("base64");

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarBase64 },
      { new: true }
    );

    res.json({ message: "Upload thành công", avatar: user.avatar, user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
