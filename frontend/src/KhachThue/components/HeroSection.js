import "../Css/HeroSection.css";

function HeroSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-title">Tìm nhà trọ lý tưởng của bạn</h2>
        <p className="hero-subtitle">
          Khám phá nhiều nhà trọ chất lượng, giá cả hợp lý và vị trí thuận tiện
        </p>

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
      </div>
    </section>
  );
}

export default HeroSection;
