import "../../Css/Phong/EditActionButtons.css";

function EditActionButtons({ onSave, onCancel, isLoading }) {
  return (
    <div className="action-buttons">
      <button className="action-btn save" onClick={onSave} disabled={isLoading}>
        {isLoading ? "💾 Đang lưu..." : "💾 Lưu thay đổi"}
      </button>
      <button
        className="action-btn cancel"
        onClick={onCancel}
        disabled={isLoading}
      >
        ❌ Hủy
      </button>
    </div>
  );
}

export default EditActionButtons;
