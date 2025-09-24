import React, { useState } from "react";
import { Mail, Lock, KeyRound } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "../Css/DangNhap.css";
import AuthCard from "../components/AuthCard";

const QuenMK = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // B1: Gửi email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setStep(2);
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // B2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setStep(3);
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // B3: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/dang-nhap");
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="background-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-circle decoration-circle-3"></div>
      </div>

      <AuthCard>
        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendEmail}>
            <h2 className="auth-title">Quên mật khẩu</h2>
            <p className="auth-subtitle">
              Nhập email để nhận mã OTP đặt lại mật khẩu
            </p>

            <div className="input-group">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Nhập email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-button ${loading ? "loading" : ""}`}
            >
              {loading ? <div className="loading-spinner"></div> : "Gửi OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <h2 className="auth-title">Nhập mã OTP</h2>
            <p className="auth-subtitle">Mã OTP đã được gửi qua email</p>

            <div className="input-group">
              <div className="input-icon">
                <KeyRound size={20} />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="auth-input"
                placeholder="Nhập mã OTP"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Xác nhận OTP"
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <h2 className="auth-title">Đặt lại mật khẩu</h2>
            <p className="auth-subtitle">Nhập mật khẩu mới của bạn</p>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="auth-input"
                placeholder="Mật khẩu mới"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="auth-input"
                placeholder="Xác nhận mật khẩu mới"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          <p>
            Nhớ mật khẩu rồi?{" "}
            <Link to="/dang-nhap" className="toggle-button">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default QuenMK;
