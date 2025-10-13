import "../../Css/Phong/PhongDetails.css";

const normalizeStatusForClassName = (status) => {
  if (!status) return "";
  return status
    .toLowerCase()
    .normalize("NFD") // Tách dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu đã tách
    .replace(/đ/g, "d") // ✅ Thêm dòng này để chuyển "đ" thành "d"
    .replace(/\s+/g, "-"); // Thay thế khoảng trắng bằng dấu gạch ngang
};

const formatCurrency = (value) => {
  if (!value) return "0";
  return value.toLocaleString("vi-VN");
};

function PhongDetails({ phong }) {
  return (
    <div className="phong-details-grid">
      <label>Tên phòng:</label>
      <span>{phong.tenPhong}</span>

      <label>Diện tích:</label>
      <span>
        {(phong.chieuDai * phong.chieuRong).toFixed(1)} m² (Dài {phong.chieuDai}
        m x Rộng {phong.chieuRong}m)
      </span>

      <label>Số người tối đa:</label>
      <span>{phong.soNguoiToiDa} người</span>

      <label>Tiền phòng:</label>
      <span>{formatCurrency(phong.tienPhong)} VNĐ/tháng</span>

      <label>Trạng thái:</label>
      <span
        className={`status-badge status-${normalizeStatusForClassName(
          phong.trangThai
        )}`}
      >
        {phong.trangThai}
      </span>

      <label>Ngày tạo:</label>
      <span>{new Date(phong.ngayTao).toLocaleDateString("vi-VN")}</span>
    </div>
  );
}

export default PhongDetails;
