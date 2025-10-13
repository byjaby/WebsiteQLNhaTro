import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/TrangChu.css";
import Header from "../components/Header";
import QuickActions from "../components/QuickActions";
import StatsCards from "../components/StatsCards";
import SearchFilter from "../components/SearchFilter";
import RoomsGrid from "../components/RoomsGrid";
import Footer from "../components/Footer";
import { useUser } from "../../context/UserContext";
import Pagination from "../components/Pagination";

function TrangChu() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ROOMS_PER_PAGE = 9; // Số phòng tối đa mỗi trang
  // 👉 lấy user trực tiếp từ hook
  const { user, loading, error, setUser } = useUser();

  const fetchRooms = () => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/phong/chu-tro/${user._id}`)
        .then((res) => setRooms(res.data))
        .catch((err) => console.error("Lỗi khi load phòng:", err));
    }
  };
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role === "nguoi_thue") {
      navigate("/");
      return;
    }
    fetchRooms();
  }, [user, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);
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

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.trangThai === "Đã thuê").length;
  const vacantRooms = rooms.filter((r) => r.trangThai === "Trống").length;

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.tenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenant &&
        room.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" || room.trangThai === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
  const endIndex = startIndex + ROOMS_PER_PAGE;
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content">
        <QuickActions user={user} />
        <StatsCards
          total={totalRooms}
          occupied={occupiedRooms}
          vacant={vacantRooms}
        />
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onAddRoom={() =>
            navigate("/them-phong", { state: { chuTroId: user._id } })
          }
        />
        <RoomsGrid rooms={paginatedRooms} fetchRooms={fetchRooms} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Footer />
    </div>
  );
}

export default TrangChu;
