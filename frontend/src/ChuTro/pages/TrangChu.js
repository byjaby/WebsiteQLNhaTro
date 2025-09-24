import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/TrangChu.css";
import Header from "../components/Header";
import QuickActions from "../components/QuickActions";
import StatsCards from "../components/StatsCards";
import SearchFilter from "../components/SearchFilter";
import RoomsGrid from "../components/RoomsGrid";
import Footer from "../components/Footer";

function TrangChu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role === "chu_tro") setUser(parsedUser);
      else navigate("/");
    } else navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:5000/api/phong/chu-tro/${user.id}`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Lỗi khi load phòng:", err));
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/dang-nhap");
  };

  if (!user) return null;

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
            navigate("/them-phong", { state: { chuTroId: user.id } })
          }
        />
        <RoomsGrid rooms={filteredRooms} />
      </div>
      <Footer />
    </div>
  );
}

export default TrangChu;
