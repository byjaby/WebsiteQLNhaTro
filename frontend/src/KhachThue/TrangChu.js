import { useEffect, useState } from "react";
import "../KhachThue/Css/TrangChu.css";
import { Link, useNavigate } from "react-router-dom";

function ChuTro() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role === "khach_thue") {
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng 101",
      price: 3500000,
      area: 25,
      available: true,
      images: ["room1.jpg"],
      address: "123 Đường ABC, Quận 1, TP.HCM",
      amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Máy giặt chung"],
      description: "Phòng sạch sẽ, thoáng mát, gần trường học và siêu thị",
    },
    {
      id: 2,
      name: "Phòng 102",
      price: 4000000,
      area: 30,
      available: true,
      images: ["room2.jpg"],
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Bếp riêng"],
      description: "Phòng có ban công, view đẹp, an ninh tốt",
    },
    {
      id: 3,
      name: "Phòng 201",
      price: 4500000,
      area: 35,
      available: true,
      images: ["room3.jpg"],
      address: "789 Đường DEF, Quận 3, TP.HCM",
      amenities: [
        "Wifi",
        "Điều hòa",
        "Tủ lạnh",
        "Phòng tắm riêng",
        "Bếp riêng",
      ],
      description: "Phòng cao cấp, đầy đủ tiện nghi, gần khu công nghiệp",
    },
    {
      id: 4,
      name: "Phòng 103",
      price: 3200000,
      area: 20,
      available: true,
      images: ["room4.jpg"],
      address: "321 Đường GHI, Quận 4, TP.HCM",
      amenities: ["Wifi", "Quạt trần", "Tủ lạnh chung"],
      description: "Phòng giá rẻ, phù hợp sinh viên, gần trường đại học",
    },
    {
      id: 5,
      name: "Phòng 202",
      price: 5000000,
      area: 40,
      available: false,
      images: ["room5.jpg"],
      address: "654 Đường JKL, Quận 5, TP.HCM",
      amenities: [
        "Wifi",
        "Điều hòa",
        "Tủ lạnh",
        "Phòng tắm riêng",
        "Bếp riêng",
        "Ban công",
      ],
      description: "Phòng VIP, view thành phố, đầy đủ nội thất cao cấp",
    },
    {
      id: 6,
      name: "Phòng 301",
      price: 3800000,
      area: 28,
      available: true,
      images: ["room6.jpg"],
      address: "987 Đường MNO, Quận 6, TP.HCM",
      amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Máy giặt chung"],
      description: "Phòng thoáng mát, gần chợ và bệnh viện",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under3" && room.price < 3000000) ||
      (priceRange === "3to4" &&
        room.price >= 3000000 &&
        room.price < 4000000) ||
      (priceRange === "4to5" &&
        room.price >= 4000000 &&
        room.price < 5000000) ||
      (priceRange === "over5" && room.price >= 5000000);

    const matchesAvailability = !showAvailableOnly || room.available;

    return matchesSearch && matchesPrice && matchesAvailability;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "area-asc":
        return a.area - b.area;
      case "area-desc":
        return b.area - a.area;
      default:
        return 0;
    }
  });

  const availableRooms = rooms.filter((room) => room.available).length;
  const averagePrice =
    rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length;

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="building-icon">🏠</div>
            <h1 className="title">Nhà Trọ Online</h1>
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link active">
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
              // ✅ Nếu đã đăng nhập
              <div className="user-info">
                <span className="user-name">👤 {user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Đăng xuất
                </button>
              </div>
            ) : (
              // ✅ Nếu chưa đăng nhập
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Tìm phòng trọ lý tưởng của bạn</h2>
          <p className="hero-subtitle">
            Hàng trăm phòng trọ chất lượng, giá cả hợp lý, đầy đủ tiện nghi
          </p>

          {/* Quick Search */}
          <div className="quick-search">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng hoặc địa chỉ..."
                className="hero-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="search-btn">Tìm kiếm</button>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{rooms.length}</span>
              <span className="stat-label">Phòng có sẵn</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{availableRooms}</span>
              <span className="stat-label">Phòng trống</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {Math.round(averagePrice / 1000000)} Triệu đồng
              </span>
              <span className="stat-label">Giá trung bình</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Khoảng giá:</label>
            <select
              className="filter-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="under3">Dưới 3 triệu</option>
              <option value="3to4">3 - 4 triệu</option>
              <option value="4to5">4 - 5 triệu</option>
              <option value="over5">Trên 5 triệu</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sắp xếp:</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="area-asc">Diện tích nhỏ đến lớn</option>
              <option value="area-desc">Diện tích lớn đến nhỏ</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
              />
              <span className="checkmark"></span>
              Chỉ hiển thị phòng còn trống
            </label>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="rooms-section">
        <div className="section-header">
          <h3 className="section-title">Danh sách phòng trọ</h3>
          <p className="section-subtitle">
            Tìm thấy {sortedRooms.length} phòng phù hợp
          </p>
        </div>

        <div className="rooms-grid">
          {sortedRooms.map((room) => (
            <div
              key={room.id}
              className={`room-card ${!room.available ? "unavailable" : ""}`}
            >
              <div className="room-image">
                <div className="image-placeholder">
                  <span className="camera-icon">📷</span>
                </div>
                <div className="room-status">
                  <span
                    className={`status-badge ${
                      room.available ? "available" : "unavailable"
                    }`}
                  >
                    {room.available ? "Còn trống" : "Đã thuê"}
                  </span>
                </div>
              </div>

              <div className="room-content">
                <h4 className="room-name">{room.name}</h4>
                <p className="room-address">📍 {room.address}</p>

                <div className="room-details">
                  <div className="detail-row">
                    <span className="detail-label">💰 Giá:</span>
                    <span className="room-price">
                      {room.price.toLocaleString("vi-VN")}đ/tháng
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Diện tích:</span>
                    <span className="room-area">{room.area}m²</span>
                  </div>
                </div>

                <div className="amenities">
                  <span className="amenities-label">Tiện nghi:</span>
                  <div className="amenities-list">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="amenity-tag">
                        +{room.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <p className="room-description">{room.description}</p>

                <div className="room-actions">
                  <button className="action-btn view-btn">
                    <span className="btn-icon">👁️</span>
                    Xem chi tiết
                  </button>
                  <button
                    className="action-btn contact-btn"
                    disabled={!room.available}
                  >
                    <span className="btn-icon">📞</span>
                    Liên hệ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Nhà Trọ Online</h4>
            <p className="footer-description">
              Nền tảng tìm kiếm phòng trọ hàng đầu, kết nối chủ nhà và người
              thuê một cách nhanh chóng và tiện lợi.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Liên hệ</h4>
            <div className="contact-info">
              <p>📞 Hotline: 1900 1234</p>
              <p>📧 Email: info@nhatroonline.com</p>
              <p>📍 Địa chỉ: 123 Đường ABC, TP.HCM</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-links">
              <li>
                <a href="#faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#guide">Hướng dẫn sử dụng</a>
              </li>
              <li>
                <a href="#policy">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#terms">Điều khoản sử dụng</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Nhà Trọ Online. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ChuTro;
