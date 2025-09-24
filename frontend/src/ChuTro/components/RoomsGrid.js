import { useNavigate } from "react-router-dom";

function RoomsGrid({ rooms }) {
  const navigate = useNavigate();

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
          <h3>{room.tenPhong}</h3>
          <span>{getStatusText(room.trangThai)}</span>
          <p>💰 {room.tienPhong.toLocaleString("vi-VN")}đ/tháng</p>
          {room.tenant && <p>👤 {room.tenant}</p>}
          {room.dueDate && <p>🕒 {room.dueDate}</p>}
          <div>
            <button onClick={() => navigate(`/phong/${room._id}`)}>Xem</button>
            <button
              onClick={() =>
                navigate(`/phong/${room._id}`, { state: { edit: true } })
              }
            >
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomsGrid;
