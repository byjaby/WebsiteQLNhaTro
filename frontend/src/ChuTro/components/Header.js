import { Link } from "react-router-dom";
import "../Css/Header.css";
import { useState } from "react";

function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);
  return (
    <header className="header">
      {" "}
      <div className="header-container">
        {" "}
        <div className="header-content">
          {" "}
          <div className="logo-wrap">
            {" "}
            <Link to="/chu-tro" className="logo-link">
              {" "}
              <div className="logo-icon">🏢</div>{" "}
              <h1 className="logo-text">Quản lý nhà trọ</h1>{" "}
            </Link>{" "}
          </div>{" "}
          <div className="actions">
            {" "}
            <button className="icon-btn">🔔</button>{" "}
            <button className="icon-btn">⚙️</button>{" "}
            {user && (
              <div className="user-menu">
                {" "}
                <button className="user-btn" onClick={toggleMenu}>
                  {" "}
                  {user.name}{" "}
                  <span className={`arrow ${open ? "rotate" : ""}`}>⏷</span>{" "}
                </button>{" "}
                {open && (
                  <div className="dropdown">
                    {" "}
                    <Link to="/ttcn" state={{ user }} className="dropdown-item">
                      {" "}
                      👤 Thông tin cá nhân{" "}
                    </Link>{" "}
                    <button onClick={onLogout} className="dropdown-item">
                      {" "}
                      🚪 Đăng xuất{" "}
                    </button>{" "}
                  </div>
                )}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}

export default Header;
