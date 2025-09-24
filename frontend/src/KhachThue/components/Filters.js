function Filters({
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showAvailableOnly,
  setShowAvailableOnly,
}) {
  return (
    <section className="filters-section">
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Khoảng giá:</label>
          <select
            className="filter-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="under3">Dưới 3 triệu</option>
            <option value="3to4">3 - 4 triệu</option>
            <option value="4to5">4 - 5 triệu</option>
            <option value="over5">Trên 5 triệu</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sắp xếp:</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <span className="checkmark"></span>
            Chỉ hiển thị nhà trọ còn phòng trống
          </label>
        </div>
      </div>
    </section>
  );
}

export default Filters;
