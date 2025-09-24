function RoomCard({ room }) {
  return (
    <div className={`room-card ${!room.available ? "unavailable" : ""}`}>
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
              <span className="amenity-tag">+{room.amenities.length - 3}</span>
            )}
          </div>
        </div>

        <p className="room-description">{room.description}</p>

        <div className="room-actions">
          <button className="action-btn view-btn">
            <span className="btn-icon">👁️</span>
            Xem chi tiết
          </button>
          <button className="action-btn contact-btn" disabled={!room.available}>
            <span className="btn-icon">📞</span>
            Liên hệ
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
