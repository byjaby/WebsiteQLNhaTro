import { useNavigate } from "react-router-dom";
import "../Css/NhaTroCard.css";
import { useUser } from "../../context/UserContext";

function toSlug(str) {
  return str
    .normalize("NFD") // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "") // bỏ khoảng trắng
    .toLowerCase();
}

function NhaTroCard({ tro }) {
  const navigate = useNavigate();
  const { user, loading, error, setUser } = useUser();

  const handleClick = () => {
    const slug = toSlug(tro.tenTro);
    navigate(`/thong-tin-tro/${slug}`, { state: { chuTroId: tro.id, user } }); // ✅ truyền user
  };

  return (
    <div
      className="nhatro-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <h4>{tro.tenTro}</h4>
      <p>
        🏠 Chủ trọ: <span>{tro.chuTro}</span>
      </p>
      <p>
        📍 Địa chỉ: <span>{tro.diaChi}</span>
      </p>
      <p className="so-phong">
        📦 Tổng số phòng: {tro.soPhong} | 🟢 Trống: {tro.phongTrong}
      </p>
      <p className="gia">
        💰{" "}
        {tro.minGia === tro.maxGia
          ? `${tro.minGia.toLocaleString()}đ`
          : `${tro.minGia.toLocaleString()}đ - ${tro.maxGia.toLocaleString()}đ`}
      </p>
    </div>
  );
}

export default NhaTroCard;
