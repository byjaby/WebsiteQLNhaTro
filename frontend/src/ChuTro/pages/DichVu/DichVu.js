import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemDV from "./ThemDV";
import BangDV from "./BangDV";
import "../../Css/DichVu/DichVu.css";
import "../../Css/TrangChu.css";
import { useUser } from "../../../context/UserContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";

function DichVu() {
  const { user, loading, error, setUser } = useUser();
  const [dichVuList, setDichVuList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    tenDichVu: "",
    donVi: "",
    donGia: "",
    moTa: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/dichvu/${user._id}`)
      .then((res) => res.json())
      .then((data) => setDichVuList(data))
      .catch((err) => console.error("Lỗi khi load dịch vụ:", err));
  }, [user._id, navigate]);

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
    setUser(null); // 👉 bây giờ hợp lệ vì đã destructure từ hook
    navigate("/");
  };
  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content">
        <div className="dichvu-container">
          <Breadcrumb
            paths={[{ label: "Trang chủ", to: "/" }, { label: "Dịch vụ" }]}
          />
          {/* Form thêm dịch vụ */}
          <ThemDV
            newService={newService}
            setNewService={setNewService}
            dichVuList={dichVuList}
            setDichVuList={setDichVuList}
          />
          <h2>Danh sách dịch vụ</h2>
          {/* Bảng dịch vụ */}
          <BangDV
            dichVuList={dichVuList}
            setDichVuList={setDichVuList}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DichVu;
