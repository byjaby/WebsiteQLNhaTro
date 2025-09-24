import { Link } from "react-router-dom";
import "../Css/Header.css";
import { useState } from "react";

function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <div className="building-icon">🏢</div>
            <h1 className="title">Quản lý nhà trọ</h1>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-button">🔔</button>
          <button className="icon-button">⚙️</button>
          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <button className="user-menu-toggle" onClick={toggleMenu}>
                  {user.name} ⏷
                </button>

                {open && (
                  <div className="user-menu-dropdown">
                    <Link
                      to="/ttcn"
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
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
