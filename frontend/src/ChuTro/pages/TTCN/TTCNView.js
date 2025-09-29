import React from "react";

function TTCNView({ user, setIsEditing, setIsChangingPassword }) {
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    });
  };

  return (
    <div className="ttcn-card">
      <p>
        <strong>Họ tên:</strong> {user.name}
      </p>
      <p>
        <strong>Ngày sinh:</strong>{" "}
        {user.ngaySinh
          ? new Date(user.ngaySinh).toLocaleDateString("vi-VN")
          : "Chưa cập nhật"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {user.soDienThoai || "Chưa cập nhật"}
      </p>
      <p>
        <strong>Tên trọ:</strong> {user.tenTro}
      </p>
      <p>
        <strong>Địa chỉ nhà trọ:</strong> {user.diaChiNhaTro}
      </p>
      <p>
        <strong>Số phòng:</strong> {user.soPhong || "Chưa cập nhật"}
      </p>
      <p>
        <strong>Ngày tạo:</strong> {formatDate(user.createdAt)}
      </p>
      <p>
        <strong>Ngày cập nhật:</strong> {formatDate(user.updatedAt)}
      </p>

      <div className="btn-group">
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          ✏️ Chỉnh sửa
        </button>
        {!user?.googleId && (
          <button
            className="password-btn"
            onClick={() => setIsChangingPassword(true)}
          >
            🔑 Đổi mật khẩu
          </button>
        )}
      </div>
    </div>
  );
}

export default TTCNView;
