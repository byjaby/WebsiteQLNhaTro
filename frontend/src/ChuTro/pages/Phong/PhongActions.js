import "../../Css/Phong/PhongActions.css";

function PhongActions({ onEditClick, onDeleteClick, isLoading }) {
  return (
    <div className="action-buttons">
      <button
        className="action-btn edit"
        onClick={onEditClick}
        disabled={isLoading}
      >
        ✏️ Chỉnh sửa
      </button>
      <button
        className="action-btn delete"
        onClick={onDeleteClick}
        disabled={isLoading}
      >
        🗑️ Xóa phòng
      </button>
    </div>
  );
}

export default PhongActions;
