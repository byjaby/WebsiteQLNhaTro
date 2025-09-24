import React, { useState } from "react";
import axios from "axios";
import "../Css/SuaThongTin.css"; // tái dùng css modal

function DoiMatKhau({ user, onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/change-password/${user._id}`,
        {
          currentPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(
        res.data.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
      );

      // ✅ Xóa token và điều hướng về login
      localStorage.removeItem("token");
      window.location.href = "/dang-nhap";
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      const msg = err.response?.data?.message || "Có lỗi khi đổi mật khẩu!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Đổi mật khẩu</h2>

        <div className="form-group">
          <label>Mật khẩu cũ:</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "⏳ Đang lưu..." : "💾 Lưu"}
          </button>
          <button onClick={onClose}>❌ Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default DoiMatKhau;
