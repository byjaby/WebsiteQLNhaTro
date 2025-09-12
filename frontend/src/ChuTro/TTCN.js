import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../ChuTro/Css/TTCN.css";

function TTCN() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập!");
      navigate("/dang-nhap");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy thông tin user:", err);
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/dang-nhap");
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/auth/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      setIsEditing(false);
      alert("✅ Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err);
      alert(
        "Cập nhật thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("❌ Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/change-password/${user._id}`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error("❌ Lỗi khi đổi mật khẩu:", err);
      alert(
        "Đổi mật khẩu thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="ttcn-container">
      <h2>👤 Thông tin cá nhân</h2>

      {!isEditing && !isChangingPassword ? (
        <div className="ttcn-card">
          <p>
            <strong>Họ tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.soDienThoai}
          </p>
          {user.tenTro && (
            <p>
              <strong>Tên trọ:</strong> {user.tenTro}
            </p>
          )}
          {user.diaChiNhaTro && (
            <p>
              <strong>Địa chỉ nhà trọ:</strong> {user.diaChiNhaTro}
            </p>
          )}
          {user.soPhong && (
            <p>
              <strong>Số phòng:</strong> {user.soPhong}
            </p>
          )}
          <p>
            <strong>Ngày tạo:</strong> {formatDate(user.createdAt)}
          </p>
          <p>
            <strong>Ngày cập nhật:</strong> {formatDate(user.updatedAt)}
          </p>

          <div className="btn-group">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Chỉnh sửa
            </button>
            <button
              className="password-btn"
              onClick={() => setIsChangingPassword(true)}
            >
              🔑 Đổi mật khẩu
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <form className="ttcn-form" onSubmit={handleUpdate}>
          <label>
            Họ tên:
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Số điện thoại:
            <input
              type="text"
              name="soDienThoai"
              value={formData.soDienThoai || ""}
              onChange={handleChange}
              required
            />
          </label>

          {user.tenTro !== undefined && (
            <label>
              Tên trọ:
              <input
                type="text"
                name="tenTro"
                value={formData.tenTro || ""}
                onChange={handleChange}
              />
            </label>
          )}

          {user.diaChiNhaTro !== undefined && (
            <label>
              Địa chỉ nhà trọ:
              <input
                type="text"
                name="diaChiNhaTro"
                value={formData.diaChiNhaTro || ""}
                onChange={handleChange}
              />
            </label>
          )}

          <div className="form-actions">
            <button type="submit" className="save-btn">
              💾 Lưu
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              ❌ Hủy
            </button>
          </div>
        </form>
      ) : (
        <form className="ttcn-form" onSubmit={handlePasswordChange}>
          <label>
            Mật khẩu hiện tại:
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Mật khẩu mới:
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Xác nhận mật khẩu mới:
            <input
              type={showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmNewPassword: e.target.value,
                })
              }
              required
            />
          </label>
          {/* Nút hiện/ẩn mật khẩu */}
          <div className="toggle-password">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-btn"
            >
              {showPassword ? "🙈 Ẩn mật khẩu" : "👁️ Hiện mật khẩu"}
            </button>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              💾 Đổi mật khẩu
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsChangingPassword(false)}
            >
              ❌ Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TTCN;
