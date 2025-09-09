import React from "react";
import "../KhachThue/Css/ThongTinCaNhan.css";

function ThongTinCaNhan() {
  const room = {
    name: "Phòng 101",
    tenant: "Nguyễn Văn A",
    price: 3500000,
    dueDate: "2024-07-15",
    status: "occupied",
  };

  const getStatusText = (status) => {
    switch (status) {
      case "occupied": return "Đang thuê";
      case "vacant": return "Trống";
      case "maintenance": return "Bảo trì";
      default: return "Không xác định";
    }
  };

  return (
    <div className="tenant-dashboard">
      <header className="tenant-header">
        <h1>Xin chào, {room.tenant}</h1>
        <p>Thông tin tổng quan phòng trọ của bạn</p>
      </header>

      <main className="tenant-main">
        <div className="room-info-card">
          <h2>{room.name}</h2>
          <p><strong>Tiền phòng:</strong> {room.price.toLocaleString('vi-VN')}đ/tháng</p>
          <p><strong>Hạn thanh toán:</strong> {room.dueDate}</p>
          <p><strong>Trạng thái:</strong> {getStatusText(room.status)}</p>
        </div>

        <div className="quick-actions">
          <h3>Thao tác nhanh</h3>
          <div className="actions-grid">
            <button className="action-button">📄 Xem hợp đồng</button>
            <button className="action-button">💬 Gửi phản hồi</button>
            <button className="action-button">📜 Xem lịch sử đóng tiền</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ThongTinCaNhan;
