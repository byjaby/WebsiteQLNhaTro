import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ChuTro/Css/ChiTietPhong.css";

function ChiTietPhong() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [phong, setPhong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false); // loading chung cho save / delete
  const [fetching, setFetching] = useState(true); // loading khi fetch ban đầu

  useEffect(() => {
    const fetchPhong = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`http://localhost:5000/api/phong/${id}`);
        setPhong(res.data);
        setFormData(res.data);
        if (location.state?.edit) {
          setIsEditing(true);
        }
      } catch (err) {
        toast.error("❌ Lỗi khi tải dữ liệu phòng!");
      } finally {
        setFetching(false);
      }
    };
    fetchPhong();
  }, [id, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/phong/${id}`, formData);
      toast.success("✅ Cập nhật thành công!");
      setPhong(formData);
      setIsEditing(false);
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/phong/${id}`);
      toast.success("🗑️ Xóa phòng thành công!");
      setTimeout(() => navigate("/chu-tro"), 2000);
    } catch (err) {
      toast.error("❌ Lỗi khi xóa phòng!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>⏳ Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (!phong) return <p>Không tìm thấy dữ liệu phòng!</p>;

  return (
    <div className="chi-tiet-phong-container">
      <h2 className="chi-tiet-phong-title">Chi tiết phòng</h2>

      <div className="phong-info">
        <label>Tên phòng:</label>
        {isEditing ? (
          <input
            type="text"
            name="tenPhong"
            value={formData.tenPhong}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <span>{phong.tenPhong}</span>
        )}

        <label>Chiều dài:</label>
        {isEditing ? (
          <input
            type="number"
            name="chieuDai"
            value={formData.chieuDai}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <span>{phong.chieuDai} m</span>
        )}

        <label>Chiều rộng:</label>
        {isEditing ? (
          <input
            type="number"
            name="chieuRong"
            value={formData.chieuRong}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <span>{phong.chieuRong} m</span>
        )}

        <label>Số người tối đa:</label>
        {isEditing ? (
          <input
            type="number"
            name="soNguoiToiDa"
            value={formData.soNguoiToiDa}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <span>{phong.soNguoiToiDa}</span>
        )}

        <label>Tiền phòng (VNĐ): </label>
        {isEditing ? (
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
        ) : (
          <span>{phong.tienPhong} VND</span>
        )}

        <label>Trạng thái:</label>
        {isEditing ? (
          <select
            name="trangThai"
            value={formData.trangThai}
            onChange={handleChange}
            className="edit-input"
          >
            <option value="Trống">Trống</option>
            <option value="Đã thuê">Đã thuê</option>
          </select>
        ) : (
          <span>{phong.trangThai}</span>
        )}
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
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
          </>
        ) : (
          <>
            <button
              className="action-btn edit"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              ✏️ Chỉnh sửa
            </button>
            <button
              className="action-btn delete"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
            >
              🗑️ Xóa phòng
            </button>
          </>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa phòng <b>{phong.tenPhong}</b> không?
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

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default ChiTietPhong;
