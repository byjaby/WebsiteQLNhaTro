// ThemPhong.js
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../ChuTro/Css/ThemPhong.css";

function ThemPhong() {
  const [formData, setFormData] = useState({
    tenPhong: "",
    chieuDai: "",
    chieuRong: "",
    soNguoiToiDa: "",
    tienPhong: "",
    trangThai: "Trống",
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Lấy chuTroId từ navigate hoặc localStorage/sessionStorage
  const savedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  // Ưu tiên lấy từ navigate, nếu không có thì fallback sang user.id
  const chuTroId = location.state?.chuTroId || user?.id || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chuTroId) {
      alert("Không tìm thấy chủ trọ, vui lòng đăng nhập lại!");
      navigate("/dang-nhap"); // điều hướng về đăng nhập
      return;
    }

    const dataToSend = {
      ...formData,
      chuTroId,
      chieuDai: parseFloat(formData.chieuDai),
      chieuRong: parseFloat(formData.chieuRong),
      soNguoiToiDa: parseInt(formData.soNguoiToiDa, 10),
      tienPhong: parseInt(formData.tienPhong, 10),
    };

    try {
      console.log("📤 Gửi dữ liệu thêm phòng:", dataToSend);
      await axios.post("http://localhost:5000/api/phong", dataToSend);
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

  return (
    <div className="add-room-form">
      <h2>Thêm phòng mới</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên phòng</label>
        <input type="text" name="tenPhong" onChange={handleChange} required />

        <label>Chiều dài (m)</label>
        <input
          type="number"
          name="chieuDai"
          step="0.1"
          onChange={handleChange}
          required
        />

        <label>Chiều rộng (m)</label>
        <input
          type="number"
          name="chieuRong"
          step="0.1"
          onChange={handleChange}
          required
        />

        <label>Số người ở tối đa</label>
        <input
          type="number"
          name="soNguoiToiDa"
          onChange={handleChange}
          required
        />

        <label>Tiền phòng (VND)</label>

        <input
          type="number"
          name="tienPhong"
          onChange={handleChange}
          required
        />
        <span>Lưu ý: không nhập dấu "," và "."</span>
        <label>Trạng thái</label>
        <select name="trangThai" onChange={handleChange}>
          <option value="Trống">Trống</option>
          <option value="Đã thuê">Đã thuê</option>
          <option value="Bảo trì">Bảo trì</option>
        </select>

        <button type="submit">Lưu</button>
      </form>
    </div>
  );
}

export default ThemPhong;
