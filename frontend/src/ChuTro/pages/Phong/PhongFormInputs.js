import "../../Css/Phong/PhongFormInputs.css";

function PhongFormInputs({ formData, onFormChange }) {
  return (
    <div className="phong-details-grid">
      <label>Tên phòng:</label>
      <input
        type="text"
        name="tenPhong"
        value={formData.tenPhong}
        onChange={onFormChange}
        className="edit-input"
      />
      <label>Chiều dài (m):</label>
      <input
        type="number"
        name="chieuDai"
        value={formData.chieuDai}
        onChange={onFormChange}
        className="edit-input"
      />
      <label>Chiều rộng (m):</label>
      <input
        type="number"
        name="chieuRong"
        value={formData.chieuRong}
        onChange={onFormChange}
        className="edit-input"
      />
      <label>Số người tối đa:</label>
      <input
        type="number"
        name="soNguoiToiDa"
        value={formData.soNguoiToiDa}
        onChange={onFormChange}
        className="edit-input"
      />
      <label>Tiền phòng (VNĐ):</label>
      <input
        type="number"
        name="tienPhong"
        value={formData.tienPhong}
        onChange={onFormChange}
        className="edit-input"
      />
      <label>Trạng thái:</label>
      <select
        name="trangThai"
        value={formData.trangThai}
        onChange={onFormChange}
        className="edit-input"
      >
        <option value="Trống">Trống</option>
        <option value="Đã thuê">Đã thuê</option>
        <option value="Bảo trì">Bảo trì</option>
      </select>
    </div>
  );
}

export default PhongFormInputs;
