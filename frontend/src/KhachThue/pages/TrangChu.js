import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/TrangChu.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Filters from "../components/Filters";
import NhaTroCard from "../components/NhaTroCard";
import HeroSection from "../components/HeroSection";

function TrangChu() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false); // ✅ thêm state
  const [nhaTros, setNhaTros] = useState([]);
  const navigate = useNavigate();

  // ✅ Lấy user và dữ liệu nhà trọ
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role === "nguoi_thue") setUser(parsedUser);
      else navigate("/chu-tro");
    } else navigate("/");
    fetch("http://localhost:5000/api/nha-tro")
      .then((res) => res.json())
      .then((data) => setNhaTros(data))
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [navigate]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/dang-nhap");
  };

  // ✅ Lọc nhà trọ
  const filteredTro = nhaTros.filter((tro) => {
    const matchesSearch =
      tro.chuTro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tro.tenTro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tro.diaChi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceRange === "under3") matchesPrice = tro.minGia < 3000000;
    if (priceRange === "3to4")
      matchesPrice = tro.minGia >= 3000000 && tro.maxGia <= 4000000;
    if (priceRange === "4to5")
      matchesPrice = tro.minGia >= 4000000 && tro.maxGia <= 5000000;
    if (priceRange === "over5") matchesPrice = tro.maxGia > 5000000;

    // ✅ Filter phòng trống
    const matchesAvailability = !showAvailableOnly || tro.phongTrong > 0;

    return matchesSearch && matchesPrice && matchesAvailability;
  });

  // ✅ Sắp xếp
  const sortedTro = [...filteredTro].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.minGia - b.minGia;
      case "price-desc":
        return b.maxGia - a.maxGia;
      case "room-asc":
        return a.soPhong - b.soPhong;
      case "room-desc":
        return b.soPhong - a.soPhong;
      default:
        return 0;
    }
  });

  return (
    <div className="homepage-container">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Bộ lọc */}
      <Filters
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showAvailableOnly={showAvailableOnly} // ✅ truyền đúng state
        setShowAvailableOnly={setShowAvailableOnly} // ✅ truyền đúng setter
      />

      {/* Danh sách nhà trọ */}
      <section className="rooms-section">
        <div className="section-header">
          <h3 className="section-title">Danh sách nhà trọ</h3>
          <p className="section-subtitle">
            Tìm thấy {sortedTro.length} nhà trọ phù hợp
          </p>
        </div>

        <div className="rooms-grid">
          {sortedTro.map((tro) => (
            <NhaTroCard key={tro.id} tro={tro} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default TrangChu;
