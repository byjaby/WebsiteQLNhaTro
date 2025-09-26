import { Link } from "react-router-dom";
import "../Css/Header.css";
import { useState } from "react";

function CloneHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <div className="building-icon">🏠</div>
            <h1 className="title">Nhà Trọ Online</h1>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
          <a href="#about" className="nav-link">
            Giới thiệu
          </a>
          <a href="#contact" className="nav-link">
            Liên hệ
          </a>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-menu-toggle" onClick={toggleMenu}>
                {user.name} ⏷
              </button>

              {open && (
                <div className="user-menu-dropdown">
                  <Link
                    to="/profile"
                    state={{ user }}
                    className="user-menu-item"
                  >
                    👤 Thông tin cá nhân
                  </Link>
                  <button className="user-menu-item" onClick={onLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/dang-nhap">
                <button className="login-btn">Đăng nhập</button>
              </Link>
              <Link to="/dang-nhap" state={{ isLogin: false }}>
                <button className="register-btn">Đăng ký</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default CloneHeader;
