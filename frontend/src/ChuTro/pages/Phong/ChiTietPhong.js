import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Css/Phong/ChiTietPhong.css";
import { useUser } from "../../../context/UserContext";
import "../../Css/TrangChu.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import SuaPhong from "./SuaPhong";

function ChiTietPhong() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [phong, setPhong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false); // loading chung cho save / delete
  const [fetching, setFetching] = useState(true); // loading khi fetch ban đầu
  const { user, error, setUser } = useUser();

  useEffect(() => {
    const fetchPhong = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`http://localhost:5000/api/phong/${id}`);
        setPhong(res.data);
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

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!user)
    return (
      <p>
        Chưa đăng nhập{" "}
        <Link to="/dang-nhap">
          <button className="login-btn">Đăng nhập</button>
        </Link>
      </p>
    );

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/");
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
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content">
        <div className="main">
          <Breadcrumb
            paths={[
              { label: "Trang chủ", to: "/" },
              { label: "Chi tiết phòng" },
            ]}
          />
        </div>

        <div className="chi-tiet-phong-container">
          <h2 className="chi-tiet-phong-title">
            Chi tiết phòng {phong.tenPhong}
          </h2>

          {isEditing ? (
            <SuaPhong
              phong={phong}
              setPhong={setPhong}
              setIsEditing={setIsEditing}
            />
          ) : (
            <div className="phong-info">
              <label>Tên phòng:</label>
              <span>{phong.tenPhong}</span>

              <label>Chiều dài:</label>
              <span>{phong.chieuDai} m</span>

              <label>Chiều rộng:</label>
              <span>{phong.chieuRong} m</span>

              <label>Số người tối đa:</label>
              <span>{phong.soNguoiToiDa}</span>

              <label>Tiền phòng (VNĐ):</label>
              <span>{phong.tienPhong} VND</span>

              <label>Trạng thái:</label>
              <span>{phong.trangThai}</span>

              <div className="action-buttons">
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
              </div>
            </div>
          )}

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

          <ToastContainer position="top-right" autoClose={2500} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietPhong;
