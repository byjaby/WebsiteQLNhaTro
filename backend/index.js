const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

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
