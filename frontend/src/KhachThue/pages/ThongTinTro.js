import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../Css/ThongTinTro.css";
import CloneHeader from "../components/CloneHeader";
import Footer from "../components/Footer";
import Filters from "../components/Filters";
import Breadcrumb from "../components/Breadcrumb";
import { useUser } from "../../context/UserContext";

function ThongTinTro() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const [phongs, setPhongs] = useState([]);
  const [chuTro, setChuTro] = useState(null);
  const { user, loading, error, setUser } = useUser();

  // state filter
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    const chuTroId = location.state?.chuTroId;

    if (chuTroId) {
      fetch(`http://localhost:5000/api/phong/tro/${chuTroId}`)
        .then((res) => res.json())
        .then((data) => {
          setChuTro(data.chuTro);
          setPhongs(data.phongs);
        })
        .catch((err) => console.error("Lỗi fetch:", err));
    }
  }, [location.state, slug]);

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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/");
  };

  const filteredPhongs = phongs.filter((phong) => {
    const matchesSearch =
      (phong.soPhong?.toString().includes(searchQuery) ?? false) || // ✅ dùng optional chaining
      phong.trangThai?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceRange === "under3") matchesPrice = phong.tienPhong < 3000000;
    if (priceRange === "3to4")
      matchesPrice = phong.tienPhong >= 3000000 && phong.tienPhong <= 4000000;
    if (priceRange === "4to5")
      matchesPrice = phong.tienPhong >= 4000000 && phong.tienPhong <= 5000000;
    if (priceRange === "over5") matchesPrice = phong.tienPhong > 5000000;

    // chỉ hiển thị phòng trống
    const matchesAvailability =
      !showAvailableOnly || phong.trangThai === "Trống";

    return matchesSearch && matchesPrice && matchesAvailability;
  });

  // ✅ Sắp xếp phòng
  const sortedPhongs = [...filteredPhongs].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.tienPhong - b.tienPhong;
      case "price-desc":
        return b.tienPhong - a.tienPhong;
      case "room-asc":
        return a.soPhong - b.soPhong;
      case "room-desc":
        return b.soPhong - a.soPhong;
      default:
        return 0;
    }
  });

  return (
    <div className="container">
      <CloneHeader user={user} onLogout={handleLogout} />

      <div className="thongtin-container">
        <Breadcrumb
          paths={[{ label: "Trang chủ", to: "/" }, { label: "Thông tin trọ" }]}
        />

        <div className="thong-tin">
          <h2>Thông tin nhà trọ {chuTro?.tenTro}</h2>
          <h4>Chủ trọ: {chuTro?.name}</h4>
          <p>Số điện thoại: {chuTro?.soDienThoai}</p>
          <p>Địa chỉ: {chuTro?.diaChiNhaTro}</p>
          <p>Tổng số phòng: {chuTro?.soPhong}</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm theo chủ trọ, tên trọ, địa chỉ..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">Tìm kiếm</button>
        </div>
        {/* Bộ lọc */}
        <Filters
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={setShowAvailableOnly}
        />

        <h3>Danh sách phòng</h3>
        <div className="phong-grid">
          {sortedPhongs.map((phong) => (
            <div key={phong._id} className="phong-card">
              <h4>Phòng {phong.tenPhong}</h4>
              <p>Giá: {phong.tienPhong.toLocaleString()}đ</p>
              <p>Trạng thái: {phong.trangThai}</p>
              <p>Số người ở tối đa: {phong.soNguoiToiDa}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ThongTinTro;
