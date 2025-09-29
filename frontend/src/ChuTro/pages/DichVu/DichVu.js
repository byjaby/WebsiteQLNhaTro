import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemDV from "./ThemDV";
import BangDV from "./BangDV";
import "../../Css/DichVu.css";
import { useUser } from "../../../context/UserContext";

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

  return (
    <div className="dichvu-container">
      <h2>Danh sách dịch vụ</h2>

      {/* Form thêm dịch vụ */}
      <ThemDV
        newService={newService}
        setNewService={setNewService}
        dichVuList={dichVuList}
        setDichVuList={setDichVuList}
      />

      {/* Bảng dịch vụ */}
      <BangDV
        dichVuList={dichVuList}
        setDichVuList={setDichVuList}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </div>
  );
}

export default DichVu;
