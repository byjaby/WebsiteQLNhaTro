import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Css/TTCN.css";
import TTCNView from "./TTCNView";
import TTCNEdit from "./TTCNEdit";
import DoiMK from "./DoiMK";
import { useUser } from "../../../context/UserContext";

function TTCN() {
  const location = useLocation();
  const { user, loading, error, setUser } = useUser();
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
    if (location.state?.forceEdit) {
      setIsEditing(true);
    }
  }, [location.state]);

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
      localStorage.setItem("user", JSON.stringify(res.data.user));
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

  return (
    <div className="ttcn-container">
      <h2>👤 Thông tin cá nhân</h2>

      {!isEditing && !isChangingPassword && (
        <TTCNView
          user={user}
          setIsEditing={() => {
            setFormData(user); // <-- copy dữ liệu user vào formData
            setIsEditing(true);
          }}
          setIsChangingPassword={setIsChangingPassword}
        />
      )}

      {isEditing && (
        <TTCNEdit
          user={user}
          formData={formData}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
          handleUpdate={handleUpdate}
        />
      )}

      {isChangingPassword && (
        <DoiMK
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setIsChangingPassword={setIsChangingPassword}
          handlePasswordChange={handlePasswordChange}
        />
      )}
    </div>
  );
}

export default TTCN;
