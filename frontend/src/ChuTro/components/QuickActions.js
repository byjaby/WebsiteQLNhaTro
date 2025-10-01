import { useNavigate } from "react-router-dom";
import "../Css/QuickActions.css";

function QuickActions({ user }) {
  const navigate = useNavigate();
  const actions = [
    { icon: "🛠️", label: "Dịch vụ", path: "/dich-vu" },
    { icon: "👥", label: "Khách thuê", path: "/khach-thue" },
    { icon: "💳", label: "Thu tiền", path: "/thu-tien" },
    { icon: "⚠️", label: "Báo cáo sự cố", path: "/su-co" },
    { icon: "📈", label: "Báo cáo", path: "/bao-cao" },
  ];
  const handleClick = (path) => {
    navigate(path, { state: { chuTroId: user._id } });
  };
  return (
    <div className="quick-actions-card">
      {" "}
      <h3 className="quick-actions-title">Tiện ích</h3>{" "}
      <div className="quick-actions-grid">
        {" "}
        {actions.map((a, i) => (
          <button
            key={i}
            className="quick-action-btn"
            onClick={() => handleClick(a.path)}
          >
            {" "}
            {a.icon} {a.label}{" "}
          </button>
        ))}{" "}
      </div>{" "}
    </div>
  );
}

export default QuickActions;
