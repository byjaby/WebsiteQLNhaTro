import { useEffect, useState } from "react";
import "../ChuTro/Css/TrangChu.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function TrangChu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role === "chu_tro") {
        setUser(parsedUser);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!user) return; // chờ user được set
        const res = await axios.get(
          `http://localhost:5000/api/phong/chu-tro/${user.id}`
        );
        setRooms(res.data); // ✅ chỉ lấy phòng của chủ trọ đang login
      } catch (err) {
        console.error("Lỗi khi load phòng:", err);
      }
    };

    fetchRooms();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/dang-nhap"); // bắt buộc quay về trang login
  };

  if (!user) return null;
  // Thống kê
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(
    (room) => room.trangThai === "Đã thuê"
  ).length;
  const vacantRooms = rooms.filter((room) => room.trangThai === "Trống").length;
  // Lọc + tìm kiếm
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.tenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenant &&
        room.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" || room.trangThai === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusText = (status) => {
    switch (status) {
      case "Đã thuê":
        return "Đã thuê";
      case "Trống":
        return "Trống";
      case "Bảo trì":
        return "Bảo trì";
      default:
        return "Không xác định";
    }
  };
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="building-icon">🏢</div>
              <h1 className="title">Quản lý nhà trọ</h1>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-button">
              <span className="bell-icon">🔔</span>
            </button>
            <button className="icon-button">
              <span className="settings-icon">⚙️</span>
            </button>
            <div className="header-actions">
              {user ? (
                // ✅ Nếu đã đăng nhập
                <div className="user-info">
                  <Link to="/ttcn">
                    <button className="user-name">👤 {user.name}</button>
                  </Link>
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
        </div>
      </header>

      <div className="main-content">
        {/* Quick Actions */}
        <div className="quick-actions-card">
          <h3 className="quick-actions-title">Thao tác nhanh</h3>
          <div className="quick-actions-grid">
            <button
              className="quick-action-btn"
              onClick={() =>
                navigate("/dich-vu", { state: { chuTroId: user.id } })
              }
            >
              <div className="quick-action-icon add-tenant">
                <span>🛠️</span>
              </div>
              <span className="quick-action-label">Dịch vụ</span>
            </button>

            <button className="quick-action-btn">
              <div className="quick-action-icon add-tenant">
                <span>👥</span>
              </div>
              <span className="quick-action-label">Khách thuê</span>
            </button>

            <button className="quick-action-btn">
              <div className="quick-action-icon collect-money">
                <span>💳</span>
              </div>
              <span className="quick-action-label">Thu tiền</span>
            </button>

            <button className="quick-action-btn">
              <div className="quick-action-icon report-issue">
                <span>⚠️</span>
              </div>
              <span className="quick-action-label">Báo cáo sự cố</span>
            </button>

            <button className="quick-action-btn">
              <div className="quick-action-icon analytics">
                <span>📈</span>
              </div>
              <span className="quick-action-label">Báo cáo</span>
            </button>
          </div>
        </div>
        <hr className="divider" />
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Tổng phòng</p>
                <p className="stat-value">{totalRooms}</p>
              </div>
              <div className="stat-icon home-icon">
                <span>🏠</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Đã thuê</p>
                <p className="stat-value occupied">{occupiedRooms}</p>
              </div>
              <div className="stat-icon users-icon">
                <span>👥</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Phòng trống</p>
                <p className="stat-value vacant">{vacantRooms}</p>
              </div>
              <div className="stat-icon calendar-icon">
                <span>📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-card">
          <div className="search-filter-content">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm phòng hoặc khách thuê..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-actions">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đã thuê">Đã thuê</option>
                <option value="Trống">Trống</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
              <button
                className="add-room-btn"
                onClick={() =>
                  navigate("/them-phong", {
                    state: { chuTroId: user?.id }, // truyền id của chủ trọ
                  })
                }
              >
                <span className="plus-icon">➕</span>
                <span>Thêm phòng</span>
              </button>
            </div>
          </div>
        </div>
        {/* Rooms Grid */}
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-header">
                <h3 className="room-name">Tên phòng: {room.tenPhong}</h3>
                <span className={`status-badge ${room.trangThai}`}>
                  Trạng thái: {getStatusText(room.trangThai)}
                </span>
              </div>

              <div className="room-details">
                <div className="detail-item">
                  <span className="detail-icon">Giá phòng 💰:</span>
                  <span className="room-price">
                    {room.tienPhong.toLocaleString("vi-VN")}đ/tháng
                  </span>
                </div>

                {room.tenant && (
                  <div className="detail-item">
                    <span className="detail-icon">👤</span>
                    <span className="tenant-name">{room.tenant}</span>
                  </div>
                )}

                {room.dueDate && (
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span className="due-date">Hạn: {room.dueDate}</span>
                  </div>
                )}
              </div>

              <div className="room-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => navigate(`/phong/${room._id}`)} // room._id là id phòng
                >
                  Xem chi tiết
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() =>
                    navigate(`/phong/${room._id}`, { state: { edit: true } })
                  }
                >
                  Chỉnh sửa
                </button>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrangChu;
