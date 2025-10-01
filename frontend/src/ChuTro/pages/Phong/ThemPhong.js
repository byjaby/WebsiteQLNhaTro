import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../Css/Phong/ThemPhong.css";
import { useUser } from "../../../context/UserContext";
import "../../Css/TrangChu.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";

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

  const navigate = useNavigate();

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
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null); // 👉 bây giờ hợp lệ vì đã destructure từ hook
    navigate("/");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const dataToSend = {
      ...formData,
      chuTroId: user._id,
      chieuDai: parseFloat(formData.chieuDai),
      chieuRong: parseFloat(formData.chieuRong),
      soNguoiToiDa: parseInt(formData.soNguoiToiDa, 10),
      tienPhong: parseInt(formData.tienPhong, 10),
    };

    try {
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
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content">
        <div className="main">
          <Breadcrumb
            paths={[{ label: "Trang chủ", to: "/" }, { label: "Thêm phòng" }]}
          />
        </div>
        <div className="add-room-form">
          <h2>Thêm phòng mới</h2>
          <form onSubmit={handleSubmit}>
            <label>Tên phòng</label>
            <input
              type="text"
              name="tenPhong"
              onChange={handleChange}
              required
            />

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
        <Footer />
      </div>
    </div>
  );
}

export default ThemPhong;
