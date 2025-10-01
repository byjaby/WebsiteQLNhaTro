import { useNavigate } from "react-router-dom";
import "../Css/RoomsGrid.css";

function RoomsGrid({ rooms }) {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case "Đã thuê":
        return "status rented";
      case "Trống":
        return "status vacant";
      case "Bảo trì":
        return "status maintenance";
      default:
        return "status unknown";
    }
  };

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
    <div className="rooms-grid">
      {rooms.map((room) => (
        <div key={room._id} className="room-card">
          <div className="room-header">
            <div className="room-gradient">
              <div className="overlay"></div>
              <span className={getStatusClass(room.trangThai)}>
                {getStatusText(room.trangThai)}
              </span>
            </div>
          </div>

          <div className="room-body">
            <h3>{room.tenPhong}</h3>
            <div className="room-info">
              <div>💰 {room.tienPhong.toLocaleString("vi-VN")}đ/tháng</div>
              {room.tenant && <div>👤 {room.tenant}</div>}
              {room.dueDate && <div>🕒 {room.dueDate}</div>}
            </div>
            <div className="room-actions">
              <button onClick={() => navigate(`/phong/${room._id}`)}>
                Xem
              </button>
              <button
                onClick={() =>
                  navigate(`/phong/${room._id}`, { state: { edit: true } })
                }
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomsGrid;
