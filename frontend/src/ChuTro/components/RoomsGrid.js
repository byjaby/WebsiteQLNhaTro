import { useNavigate } from "react-router-dom";
import "../Css/RoomsGrid.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function RoomsGrid({ rooms, fetchRooms }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // ✅ Mở modal xác nhận xóa
  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  // ✅ Hàm xóa
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/phong/${selectedRoom._id}`);
      toast.success("🗑️ Xóa phòng thành công!", { autoClose: 2000 });
      setShowDeleteModal(false);
      setSelectedRoom(null);
      if (fetchRooms) fetchRooms(); // reload danh sách
    } catch (err) {
      toast.error("❌ Lỗi khi xóa phòng!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            {/* ✅ Ảnh bìa */}
            <div className="room-header">
              <div className="room-gradient">
                {room.coverImage ? (
                  <img
                    src={`http://localhost:5000${room.coverImage}`}
                    alt={room.tenPhong}
                    className="room-cover-image"
                  />
                ) : (
                  <div className="no-image">Không có ảnh</div>
                )}
                <div className="overlay"></div>
                <span className={getStatusClass(room.trangThai)}>
                  {getStatusText(room.trangThai)}
                </span>
              </div>
            </div>

            <div className="room-body">
              <h3>Tên phòng: {room.tenPhong}</h3>
              <div className="room-info">
                <div>
                  💰 Giá: {room.tienPhong.toLocaleString("vi-VN")}đ/tháng
                </div>
                {room.tenant && <div>👤 {room.tenant}</div>}
                {room.dueDate && <div>🕒 {room.dueDate}</div>}
              </div>
              <div className="room-actions">
                <button
                  className="add"
                  onClick={() => navigate(`/phong/${room._id}`)}
                >
                  Xem
                </button>
                <button
                  className="update"
                  onClick={() =>
                    navigate(`/phong/${room._id}`, { state: { edit: true } })
                  }
                >
                  Sửa
                </button>
                <button
                  className="delete"
                  onClick={() => openDeleteModal(room)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modal xác nhận xóa */}
      {showDeleteModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Xác nhận xóa</h3>
            <p>
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phòng{" "}
              <b>{selectedRoom.tenPhong}</b> không?
            </p>
            <div className="modal-actions">
              <button
                className="action-btn delete"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "⏳ Đang xóa..." : "🗑️ Xóa"}
              </button>
              <button
                className="action-btn cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
      />
    </>
  );
}

export default RoomsGrid;
