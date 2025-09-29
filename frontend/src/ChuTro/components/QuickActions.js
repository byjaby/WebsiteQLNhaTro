import { useNavigate } from "react-router-dom";

function QuickActions({ user }) {
  const navigate = useNavigate();
  return (
    <div className="quick-actions-card">
      <h3 className="quick-actions-title">Thao tác nhanh</h3>
      <div className="quick-actions-grid">
        <button
          className="quick-action-btn"
          onClick={() =>
            navigate("/dich-vu", { state: { chuTroId: user._id } })
          }
        >
          🛠️ Dịch vụ
        </button>
        <button className="quick-action-btn">👥 Khách thuê</button>
        <button className="quick-action-btn">💳 Thu tiền</button>
        <button className="quick-action-btn">⚠️ Báo cáo sự cố</button>
        <button className="quick-action-btn">📈 Báo cáo</button>
      </div>
    </div>
  );
}

export default QuickActions;
