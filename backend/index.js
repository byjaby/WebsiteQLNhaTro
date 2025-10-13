const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat", // bạn nên để trong .env
    resave: false,
    saveUninitialized: false,
  })
);

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Cho phép truy cập thư mục uploads từ browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const fs = require("fs");
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Import routes
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const phongRoutes = require("./routes/Phong");
const dichVuRoutes = require("./routes/DichVu");
const nhaTroRoutes = require("./routes/nhaTro");

app.use("/api/nha-tro", nhaTroRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/phong", phongRoutes);
app.use("/api/dichvu", dichVuRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Kết nối DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
