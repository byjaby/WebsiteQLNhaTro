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
import "../Css/DangNhap.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AuthHeader from "../components/AuthHeader";
import RoleOptions from "../components/RoleOptions";
import SocialLogin from "../components/SocialLogin";
import ToggleMode from "../components/ToggleMode";
import AuthCard from "../components/AuthCard";
import { useUser } from "../context/UserContext";

const DangNhap = () => {
  const { setUser } = useUser();
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
  const [role, setRole] = useState("nguoi_thue"); // mặc định: người thuê trọ

  // Nhận state từ router & xử lý token từ Google
  useEffect(() => {
    // 1. Kiểm tra nếu có token từ Google OAuth callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      fetch(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const user = data.user;
          localStorage.setItem("user", JSON.stringify(user));

          if (user.role === "nguoi_thue") {
            navigate("/");
          } else if (user.role === "chu_tro") {
            navigate("/chu-tro");
          } else {
            // fallback nếu role không xác định
            navigate("/dang-nhap");
          }
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

    // Sau đó mới check token để navigate
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (savedToken && savedUser) {
      navigate("/");
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
        diaChi: formData.diaChi,
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
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          if (data.user.role === "chu_tro") {
            navigate("/chu-tro");
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
            diaChi: "",
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
      <div className="background-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-circle decoration-circle-3"></div>
      </div>

      <AuthCard>
        <AuthHeader isLogin={isLogin} />
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
                  name="diaChi"
                  value={formData.diaChi || ""}
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
              <Link to="/quen-mat-khau" className="forgot-password">
                Quên mật khẩu?
              </Link>
            </div>
          )}

          {!isLogin && <RoleOptions role={role} setRole={setRole} />}

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

        <SocialLogin />

        <ToggleMode isLogin={isLogin} toggleMode={toggleMode} />
      </AuthCard>
    </div>
  );
};

export default DangNhap;
