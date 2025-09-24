import React from "react";
import "../Css/ToggleMode.css";

const ToggleMode = ({ isLogin, toggleMode }) => {
  return (
    <div className="auth-toggle">
      <p>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
        <button onClick={toggleMode} className="toggle-button">
          {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
        </button>
      </p>
    </div>
  );
};

export default ToggleMode;
