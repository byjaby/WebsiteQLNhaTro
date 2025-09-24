import React from "react";
import { User } from "lucide-react";
import "../Css/AuthHeader.css";

const AuthHeader = ({ isLogin }) => {
  return (
    <div className="auth-header">
      <div className="auth-icon">
        <User size={32} />
      </div>
      <h2 className="auth-title">
        {isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
      </h2>
      <p className="auth-subtitle">
        {isLogin ? "Đăng nhập để tiếp tục" : "Đăng ký để bắt đầu"}
      </p>
    </div>
  );
};

export default AuthHeader;
