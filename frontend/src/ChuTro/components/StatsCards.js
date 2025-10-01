import "../Css/StatsCards.css";

function StatsCards({ total, occupied, vacant }) {
  const stats = [
    { label: "Tổng phòng", value: total, icon: "🏠", color: "blue" },
    { label: "Đã thuê", value: occupied, icon: "👥", color: "green" },
    { label: "Phòng trống", value: vacant, icon: "📅", color: "purple" },
  ];
  return (
    <div className="stats-grid">
      {" "}
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          {" "}
          <div className="stat-info">
            {" "}
            <p className="stat-label">{stat.label}</p>{" "}
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>{" "}
          </div>{" "}
          <div className={`stat-icon ${stat.color}`}> {stat.icon} </div>{" "}
        </div>
      ))}{" "}
    </div>
  );
}

export default StatsCards;
