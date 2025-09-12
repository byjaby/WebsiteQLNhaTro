const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
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
// Import routes
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const phongRoutes = require("./routes/Phong");
const dichVuRoutes = require("./routes/DichVu");

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/phong", phongRoutes);
app.use("/api/dichvu", dichVuRoutes);

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
