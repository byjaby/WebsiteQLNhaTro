import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../Css/Phong/ThemPhong.css"; // File CSS bạn đã cung cấp
import "../../Css/TrangChu.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { useUser } from "../../../context/UserContext";

// Import các component cần thiết từ dnd-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy, // Sắp xếp theo chiều ngang
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ================================================================
// Component con để hiển thị một ảnh có thể kéo thả
// ================================================================
function SortableImageItem({ image, index, isCover, onRemove, onSetCover }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  // Style để áp dụng hiệu ứng kéo thả
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1, // Đảm bảo ảnh đang kéo nổi lên trên
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-preview-item ${isCover ? "is-cover" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
      // Gắn các sự kiện kéo thả vào đây
      {...attributes}
      {...listeners}
      // ✅ Đặt onClick ở đây. Nó sẽ hoạt động nhờ activationConstraint.
      onClick={() => onSetCover(image.id)}
    >
      {/* Ảnh preview (không cần onClick ở đây nữa) */}
      <img src={image.preview} alt={`Preview ${index + 1}`} />

      {/* Hiển thị tag "Bìa" hoặc số thứ tự */}
      {isCover ? (
        <span className="cover-badge">Bìa</span>
      ) : (
        <span className="number-badge">{index + 1}</span>
      )}

      {/* Nút xóa ảnh */}
      <button
        type="button"
        className="remove-image-btn"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện onClick của div cha (onSetCover)
          onRemove(image.id);
        }}
      >
        &times;
      </button>
    </div>
  );
}

// ================================================================
// Component chính: ThemPhong
// ================================================================
function ThemPhong() {
  const { user, loading, error, setUser } = useUser();
  const [formData, setFormData] = useState({
    tenPhong: "",
    chieuDai: "",
    chieuRong: "",
    soNguoiToiDa: "",
    tienPhong: "",
    trangThai: "Trống",
  });

  // ✅ State đã được cấu trúc lại cho dnd-kit
  const [images, setImages] = useState([]); // State lưu ảnh dạng { id, file, preview }
  const [coverImageId, setCoverImageId] = useState(null); // State lưu ID của ảnh bìa

  const navigate = useNavigate();

  // Cấu hình sensor cho dnd-kit (hỗ trợ cả chuột và bàn phím)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // ✅ Yêu cầu chuột di chuyển 10px trước khi kích hoạt kéo
      // Điều này cho phép sự kiện onClick hoạt động bình thường
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 10) {
      alert("Bạn chỉ có thể thêm tối đa 10 hình ảnh.");
      return;
    }

    // Chuyển đổi file thành object mà dnd-kit có thể dùng
    const newImages = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random()}`, // ID duy nhất để dnd-kit nhận diện
      file: file,
      preview: URL.createObjectURL(file),
    }));

    const allImages = [...images, ...newImages];
    setImages(allImages);

    // Tự động đặt ảnh đầu tiên làm bìa nếu chưa có
    if (!coverImageId && allImages.length > 0) {
      setCoverImageId(allImages[0].id);
    }
  };

  const handleRemoveImage = (idToRemove) => {
    const newImages = images.filter((img) => img.id !== idToRemove);
    setImages(newImages);

    // Nếu ảnh bìa bị xóa, tự động chọn ảnh đầu tiên còn lại làm bìa mới
    if (coverImageId === idToRemove) {
      setCoverImageId(newImages.length > 0 ? newImages[0].id : null);
    }
  };

  // ✅ Hàm xử lý chính khi kéo thả xong
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // Di chuyển phần tử trong mảng đến vị trí mới
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ... (logic kiểm tra thông tin user của bạn giữ nguyên)
    const requiredFields = ["ngaySinh", "soDienThoai"];
    const missingFields = requiredFields.filter((field) => !user?.[field]);

    if (missingFields.length > 0) {
      const confirmEdit = window.confirm(
        "Thông tin cá nhân của bạn chưa đầy đủ!\n" +
          "Bạn cần cập nhật thông tin cá nhân trước khi thêm phòng.\n" +
          "Có muốn chuyển đến trang chỉnh sửa thông tin cá nhân không?"
      );
      if (confirmEdit) {
        navigate("/ttcn", { state: { forceEdit: true } });
      }
      return;
    }

    const formDataToSend = new FormData();

    // Thêm các trường dữ liệu text
    formDataToSend.append("tenPhong", formData.tenPhong);
    formDataToSend.append("trangThai", formData.trangThai);
    formDataToSend.append("chieuDai", formData.chieuDai);
    formDataToSend.append("chieuRong", formData.chieuRong);
    formDataToSend.append("soNguoiToiDa", formData.soNguoiToiDa);
    formDataToSend.append("tienPhong", formData.tienPhong);
    formDataToSend.append("chuTroId", user._id);

    // ✅ Gửi file và index ảnh bìa một cách chính xác
    images.forEach((image) => {
      formDataToSend.append("images", image.file);
    });

    const coverIndex = images.findIndex((img) => img.id === coverImageId);
    formDataToSend.append("coverImageIndex", coverIndex >= 0 ? coverIndex : 0);

    try {
      await axios.post("http://localhost:5000/api/phong", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm phòng thành công!");
      navigate("/chu-tro");
    } catch (err) {
      console.error(
        "❌ Lỗi khi thêm phòng:",
        err.response?.data || err.message
      );
      alert(
        "Lỗi khi thêm phòng: " + (err.response?.data?.error || err.message)
      );
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!user)
    return (
      <p>
        Chưa đăng nhập{" "}
        <Link to="/dang-nhap">
          <button className="login-btn">Đăng nhập</button>
        </Link>
      </p>
    );

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content">
        <div className="main">
          <Breadcrumb
            paths={[{ label: "Trang chủ", to: "/" }, { label: "Thêm phòng" }]}
          />
        </div>
        <div className="add-room-form-container">
          <h2>Thêm phòng mới</h2>
          <form onSubmit={handleSubmit}>
            {/* ... (Các input text: tenPhong, chieuDai... giữ nguyên) */}
            <div className="form-group">
              <label htmlFor="tenPhong">Tên phòng</label>
              <input
                type="text"
                id="tenPhong"
                name="tenPhong"
                value={formData.tenPhong}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="chieuDai">Chiều dài (m)</label>
                <input
                  type="number"
                  id="chieuDai"
                  name="chieuDai"
                  step="0.1"
                  value={formData.chieuDai}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="chieuRong">Chiều rộng (m)</label>
                <input
                  type="number"
                  id="chieuRong"
                  name="chieuRong"
                  step="0.1"
                  value={formData.chieuRong}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="soNguoiToiDa">Số người ở tối đa</label>
              <input
                type="number"
                id="soNguoiToiDa"
                name="soNguoiToiDa"
                value={formData.soNguoiToiDa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tienPhong">Tiền phòng (VND)</label>
              <input
                type="number"
                id="tienPhong"
                name="tienPhong"
                value={formData.tienPhong}
                onChange={handleChange}
                required
              />
              <span className="input-hint">
                Lưu ý: không nhập dấu "," và "."
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="trangThai">Trạng thái</label>
              <select
                id="trangThai"
                name="trangThai"
                value={formData.trangThai}
                onChange={handleChange}
              >
                <option value="Trống">Trống</option>
                <option value="Đã thuê">Đã thuê</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
            </div>

            {/* ✅ Phần hiển thị ảnh đã được tích hợp dnd-kit */}
            <div className="form-group image-upload-section">
              <label>Hình ảnh phòng trọ (Kéo thả để sắp xếp)</label>
              <input
                type="file"
                id="roomImages"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((i) => i.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="image-preview-container">
                    {images.map((image, index) => (
                      <SortableImageItem
                        key={image.id}
                        image={image}
                        index={index}
                        isCover={image.id === coverImageId}
                        onRemove={handleRemoveImage}
                        onSetCover={setCoverImageId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            <button type="submit" className="submit-button">
              Thêm phòng
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ThemPhong;
