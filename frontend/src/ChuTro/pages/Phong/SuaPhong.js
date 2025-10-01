import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SuaPhong({ phong, setPhong, setIsEditing }) {
  const [formData, setFormData] = useState(phong);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/phong/${phong._id}`, formData);
      toast.success("✅ Cập nhật thành công!");
      setPhong(formData);
      setIsEditing(false);
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật phòng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phong-info">
      <label>Tên phòng:</label>
      <input
        type="text"
        name="tenPhong"
        value={formData.tenPhong}
        onChange={handleChange}
        className="edit-input"
      />

      <label>Chiều dài:</label>
      <input
        type="number"
        name="chieuDai"
        value={formData.chieuDai}
        onChange={handleChange}
        className="edit-input"
      />

      <label>Chiều rộng:</label>
      <input
        type="number"
        name="chieuRong"
        value={formData.chieuRong}
        onChange={handleChange}
        className="edit-input"
      />

      <label>Số người tối đa:</label>
      <input
        type="number"
        name="soNguoiToiDa"
        value={formData.soNguoiToiDa}
        onChange={handleChange}
        className="edit-input"
      />

      <label>Tiền phòng (VNĐ): </label>
      <div className="input-wrapper">
        <input
          type="number"
          name="tienPhong"
          value={formData.tienPhong}
          onChange={handleChange}
          className="edit-input"
        />
        <span className="note">Không nhập dấu "," và "."</span>
      </div>

      <label>Trạng thái:</label>
      <select
        name="trangThai"
        value={formData.trangThai}
        onChange={handleChange}
        className="edit-input"
      >
        <option value="Trống">Trống</option>
        <option value="Đã thuê">Đã thuê</option>
      </select>

      <div className="action-buttons">
        <button
          className="action-btn save"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "💾 Đang lưu..." : "💾 Lưu"}
        </button>
        <button
          className="action-btn cancel"
          onClick={() => setIsEditing(false)}
          disabled={loading}
        >
          ❌ Hủy
        </button>
      </div>
    </div>
  );
}

export default SuaPhong;
