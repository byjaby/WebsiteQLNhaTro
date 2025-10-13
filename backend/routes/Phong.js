// routes/phong.js
const express = require("express");
const router = express.Router();
const Phong = require("../models/Phong");
const User = require("../models/User"); // ✅ thêm
const multer = require("multer"); // Import multer
const path = require("path"); // Để xử lý đường dẫn file
const fs = require("fs"); // Để xóa file

// --- Cấu hình Multer để lưu trữ ảnh ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/phong");
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Thư mục lưu trữ ảnh
  },
  filename: function (req, file, cb) {
    // Đổi tên file để tránh trùng lặp
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Hàm kiểm tra loại file
function checkFileType(file, cb) {
  // Cho phép các đuôi file ảnh
  const filetypes = /jpeg|jpg|png|gif/;
  // Kiểm tra đuôi file
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Kiểm tra mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Lỗi: Chỉ chấp nhận file ảnh!");
  }
}
// --- Kết thúc cấu hình Multer ---

// 🏠 Thêm phòng (Sử dụng middleware upload.array để xử lý nhiều ảnh)
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.body.chuTroId) {
      // Nếu có file upload nhưng thiếu chuTroId, xóa các file đã upload
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res.status(400).json({ error: "Thiếu chuTroId" });
    }

    // ================================================================
    // ✅ BẮT ĐẦU ĐOẠN CODE MỚI ĐỂ KIỂM TRA TÊN PHÒNG
    // ================================================================
    const { tenPhong, chuTroId } = req.body;

    // Tìm một phòng có cùng tên VÀ cùng chủ trọ
    const existingPhong = await Phong.findOne({
      tenPhong: tenPhong,
      chuTroId: chuTroId,
    });

    // Nếu tìm thấy phòng có tên trùng
    if (existingPhong) {
      // Xóa các file ảnh vừa được tải lên để tránh rác server
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      // Trả về lỗi 409 (Conflict) với thông báo rõ ràng
      return res
        .status(409)
        .json({ error: "Tên phòng đã tồn tại. Vui lòng chọn tên khác." });
    }
    // ================================================================
    // ✅ KẾT THÚC ĐOẠN CODE MỚI
    // ================================================================

    // Nếu không có lỗi, code sẽ tiếp tục chạy như cũ
    const { coverImageIndex, ...otherBody } = req.body;
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/phong/${file.filename}`)
      : [];

    let coverImageUrl = imageUrls[0] || ""; // Mặc định ảnh đầu tiên là bìa
    if (
      imageUrls.length > 0 &&
      typeof coverImageIndex !== "undefined" &&
      imageUrls[coverImageIndex]
    ) {
      coverImageUrl = imageUrls[parseInt(coverImageIndex, 10)];
    }

    const newPhong = new Phong({
      ...otherBody,
      chuTroId: req.body.chuTroId,
      images: imageUrls,
      coverImage: coverImageUrl,
    });
    const savedPhong = await newPhong.save();

    // Cập nhật số phòng của chủ trọ +1
    await User.findByIdAndUpdate(savedPhong.chuTroId, {
      $inc: { soPhong: 1 },
    });

    res.status(201).json(savedPhong);
  } catch (err) {
    console.error("❌ Lỗi khi lưu phòng:", err);
    // Nếu có lỗi, xóa các file đã upload để tránh rác
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/phong/chu-tro/:chuTroId
router.get("/chu-tro/:chuTroId", async (req, res) => {
  try {
    const rooms = await Phong.find({ chuTroId: req.params.chuTroId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Lấy chi tiết 1 phòng theo id
router.get("/:id", async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id).select("-chuTroId -__v");
    if (!phong)
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    res.json(phong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Cập nhật thông tin phòng (Đã nâng cấp để xử lý ảnh)
router.put("/:id", upload.array("newImages", 10), async (req, res) => {
  try {
    const phongToUpdate = await Phong.findById(req.params.id);
    if (!phongToUpdate) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    // 1. Xử lý các file ảnh mới được tải lên
    const newImageUrls = req.files
      ? req.files.map((file) => `/uploads/phong/${file.filename}`)
      : [];

    // 2. Lấy danh sách ảnh cũ được giữ lại từ form
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    // 3. Kết hợp ảnh cũ và ảnh mới để tạo danh sách ảnh cuối cùng
    const finalImages = [...existingImages, ...newImageUrls];

    // 4. Xác định ảnh bìa mới
    let finalCoverImage = "";
    if (req.body.coverImage) {
      // Nếu ảnh bìa là ảnh cũ
      finalCoverImage = req.body.coverImage;
    } else if (req.body.newCoverImageIndex) {
      // Nếu ảnh bìa là ảnh mới
      const index = parseInt(req.body.newCoverImageIndex, 10);
      finalCoverImage = newImageUrls[index];
    } else if (finalImages.length > 0) {
      // Fallback: lấy ảnh đầu tiên
      finalCoverImage = finalImages[0];
    }

    // 5. Xác định và xóa các ảnh không còn sử dụng
    const oldImages = phongToUpdate.images;
    const imagesToDelete = oldImages.filter(
      (img) => !existingImages.includes(img)
    );

    imagesToDelete.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // 6. Cập nhật document trong DB
    const updatedData = {
      ...req.body,
      images: finalImages,
      coverImage: finalCoverImage,
    };

    const updatedPhong = await Phong.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({ message: "Cập nhật thành công", phong: updatedPhong });
  } catch (err) {
    // Xóa các file mới upload nếu có lỗi xảy ra
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    console.error("Lỗi khi cập nhật phòng:", err);
    res.status(400).json({ message: err.message });
  }
});

// 🗑️ Xóa phòng theo id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Phong.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });
    }

    // ✅ Giảm số phòng của chủ trọ -1
    await User.findByIdAndUpdate(deleted.chuTroId, {
      $inc: { soPhong: -1 },
    });

    return res
      .status(200)
      .json({ message: "Xóa phòng thành công", id: req.params.id });
  } catch (err) {
    console.error("❌ Lỗi khi xóa phòng:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả phòng của 1 chủ trọ
router.get("/tro/:chuTroId", async (req, res) => {
  try {
    const { chuTroId } = req.params;
    const chuTro = await User.findById(chuTroId);
    if (!chuTro)
      return res.status(404).json({ message: "Không tìm thấy chủ trọ" });

    const phongs = await Phong.find({ chuTroId });
    res.json({ chuTro, phongs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
