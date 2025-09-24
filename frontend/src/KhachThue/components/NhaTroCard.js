import "../Css/NhaTroCard.css";

function NhaTroCard({ tro }) {
  return (
    <div className="nhatro-card">
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
