const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Kiểm tra có token trong header không
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gán thông tin user vào request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
