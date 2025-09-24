// src/components/SuaThongTin.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/SuaThongTin.css";

function SuaThongTin({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    ngaySinh: "",
    soDienThoai: "",
    diaChi: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        ngaySinh: user.ngaySinh ? user.ngaySinh.slice(0, 10) : "",
        soDienThoai: user.soDienThoai || "",
        diaChi: user.diaChi || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/nguoithue/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Cập nhật thành công!");
      onUpdated(res.data.user); // báo cho Profile biết user mới
      onClose(); // đóng form
    } catch (err) {
      console.error("Lỗi cập nhật:", err);

      // ✅ lấy thông báo cụ thể từ backend (nếu có)
      const msg = err.response?.data?.message || "Có lỗi khi cập nhật!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cập nhật thông tin</h2>

        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="ngaySinh"
            value={formData.ngaySinh}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="diaChi"
            value={formData.diaChi}
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

export default SuaThongTin;
