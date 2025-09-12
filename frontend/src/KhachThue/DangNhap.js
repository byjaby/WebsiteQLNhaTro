import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  Phone,
  House,
} from "lucide-react";
import "../KhachThue/Css/DangNhap.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DangNhap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("nguoi_thue"); // mặc định: người thuê trọ

  // Nhận state từ router & xử lý token từ Google
  useEffect(() => {
    // 1. Kiểm tra nếu có token từ Google OAuth callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token); // ✅ sử dụng named import
      const userId = decoded.id;

      fetch(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
        })
        .catch((err) => console.error(err));

      window.history.replaceState({}, document.title, "/");
      return;
    }

    // 2. Nếu từ trang khác chuyển sang đăng ký
    if (location.state?.isLogin === false) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }

    // 3. Nếu có rememberMe thì điền sẵn email + password
    const savedLogin = localStorage.getItem("loginData");
    if (savedLogin) {
      const { email, password } = JSON.parse(savedLogin);
      setFormData((prev) => ({
        ...prev,
        email,
        password,
      }));
      setRememberMe(true);
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Chỉ lấy field cần thiết theo role
    let payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      soDienThoai: formData.soDienThoai,
      role,
    };

    if (role === "chu_tro") {
      payload = {
        ...payload,
        tenTro: formData.tenTro,
        diaChiNhaTro: formData.diaChiNhaTro,
      };
    } else if (role === "nguoi_thue") {
      payload = {
        ...payload,
        diaChiNguoiThue: formData.diaChiNguoiThue,
      };
    }

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Kết quả:", data);

      if (response.ok) {
        alert(data.message);

        if (isLogin) {
          if (rememberMe) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            localStorage.setItem(
              "loginData",
              JSON.stringify({
                email: formData.email,
                password: formData.password,
              })
            );
          } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            localStorage.removeItem("loginData");
          }

          // 👉 Điều hướng theo role
          if (data.user.role === "chu_tro") {
            navigate("/chu-tro", { state: { user: data.user } });
          } else {
            navigate("/");
          }
        } else {
          setIsLogin(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            soDienThoai: "",
            tenTro: "",
            diaChiNhaTro: "",
            diaChiNguoiThue: "",
          });
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="auth-container">
      {/* Background decoration */}
      <div className="background-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-circle decoration-circle-3"></div>
      </div>

      <div className="auth-card-wrapper">
        {/* Glass card */}
        <div className="auth-card">
          {/* Header */}
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

          {/* Form */}
          <div className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <div className="input-icon">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Họ và tên"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="auth-input"
                placeholder="Email"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="auth-input"
                placeholder="Mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <div className="input-group">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Xác nhận mật khẩu"
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="input-group">
                  <div className="input-icon">
                    <Phone size={20} />
                  </div>
                  <input
                    type="number"
                    name="soDienThoai"
                    value={formData.soDienThoai || ""}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 11); // tối đa 11 số
                      handleInputChange({
                        target: { name: "soDienThoai", value },
                      });
                    }}
                    className="auth-input phone-input"
                    placeholder="Số điện thoại"
                    required
                  />
                </div>
              </>
            )}
            {!isLogin && role === "nguoi_thue" && (
              <>
                <div className="input-group">
                  <div className="input-icon">
                    <House size={20} />
                  </div>
                  <input
                    type="text"
                    name="diaChiNguoiThue"
                    value={formData.diaChiNguoiThue || ""}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Địa chỉ"
                    required
                  />
                </div>
              </>
            )}
            {/* Nếu là chủ trọ thì hiện form cũ */}
            {!isLogin && role === "chu_tro" && (
              <>
                <div className="input-group">
                  <div className="input-icon">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="tenTro"
                    value={formData.tenTro || ""}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Tên trọ"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <House size={20} />
                  </div>
                  <input
                    type="text"
                    name="diaChiNhaTro"
                    value={formData.diaChiNhaTro || ""}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Địa chỉ trọ"
                    required
                  />
                </div>
              </>
            )}

            {isLogin && (
              <div className="auth-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/quen-mat-khau" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="role-options">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="nguoi_thue"
                    checked={role === "nguoi_thue"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Người thuê trọ
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="chu_tro"
                    checked={role === "chu_tro"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Chủ trọ
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`auth-button ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  {" "}
                  {isLogin ? "Đăng nhập" : "Đăng ký"} <ArrowRight size={20} />{" "}
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>Hoặc tiếp tục với</span>
          </div>

          {/* Social login */}
          <div className="social-login">
            <button
              className="social-button"
              onClick={() =>
                (window.location.href = "http://localhost:5000/api/auth/google")
              }
            >
              <Chrome size={20} />
              <span>Google</span>
            </button>

            <button className="social-button">
              <Github size={20} />
              <span>GitHub</span>
            </button>
          </div>

          {/* Toggle mode */}
          <div className="auth-toggle">
            <p>
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              <button onClick={toggleMode} className="toggle-button">
                {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
              </button>
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
      </div>
    </div>
  );
};

export default DangNhap;
