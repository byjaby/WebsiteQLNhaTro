import "../Css/TrangChu.css";
function StatsCards({ total, occupied, vacant }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Tổng phòng</p>
          <p className="stat-value">{total}</p>
        </div>
        <span>🏠</span>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Đã thuê</p>
          <p className="stat-value occupied">{occupied}</p>
        </div>
        <span>👥</span>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Phòng trống</p>
          <p className="stat-value vacant">{vacant}</p>
        </div>
        <span>📅</span>
      </div>
    </div>
  );
}

export default StatsCards;
