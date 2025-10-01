import "../Css/SearchFilter.css";

function SearchFilter({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onAddRoom,
}) {
  return (
    <div className="search-filter-card">
      {" "}
      <div className="search-container">
        {" "}
        <input
          type="text"
          placeholder="Tìm kiếm phòng hoặc khách thuê..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={() => console.log("Tìm kiếm:", searchTerm)}
        >
          🔍 Tìm kiếm
        </button>
      </div>{" "}
      <div className="filter-actions">
        {" "}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {" "}
          <option value="all">Tất cả</option>{" "}
          <option value="Đã thuê">Đã thuê</option>{" "}
          <option value="Trống">Trống</option>{" "}
          <option value="Bảo trì">Bảo trì</option>{" "}
        </select>{" "}
        <button className="add-room-btn" onClick={onAddRoom}>
          ➕ Thêm phòng
        </button>{" "}
      </div>{" "}
    </div>
  );
}

export default SearchFilter;
