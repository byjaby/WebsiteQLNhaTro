import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../../context/UserContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import SuaPhong from "./SuaPhong";
import ImageGallery from "./ImageGallery";
import PhongDetails from "./PhongDetails";
import PhongActions from "./PhongActions";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "../../Css/Phong/ChiTietPhong.css";

function ChiTietPhong() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, error, setUser } = useUser();

  const [phong, setPhong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false); // Dùng cho hành động xóa
  const [fetching, setFetching] = useState(true); // Dùng cho tải trang ban đầu

  useEffect(() => {
    const fetchPhong = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`http://localhost:5000/api/phong/${id}`);
        setPhong(res.data);
        if (location.state?.edit) {
          setIsEditing(true);
          navigate(location.pathname, { replace: true, state: null });
        }
      } catch (err) {
        toast.error("❌ Lỗi khi tải dữ liệu phòng!");
      } finally {
        setFetching(false);
      }
    };
    fetchPhong();
  }, [id, location, navigate]);

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
      toast.success("🗑️ Xóa phòng thành công!", {
        onClose: () => navigate("/chu-tro"),
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("❌ Lỗi khi xóa phòng!");
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // ----- Render Logic -----
  if (fetching) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>⏳ Đang tải thông tin phòng...</p>
      </div>
    );
  }

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
            Chi tiết phòng: {phong.tenPhong}
          </h2>

          {isEditing ? (
            <SuaPhong
              phong={phong}
              setPhong={setPhong}
              setIsEditing={setIsEditing}
            />
          ) : (
            <div className="phong-info">
              <ImageGallery
                images={phong.images}
                coverImage={phong.coverImage}
              />
              <PhongDetails phong={phong} />
              <PhongActions
                onEditClick={() => setIsEditing(true)}
                onDeleteClick={() => setShowDeleteModal(true)}
                isLoading={loading}
              />
            </div>
          )}
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isLoading={loading}
          tenPhong={phong.tenPhong}
        />

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietPhong;
