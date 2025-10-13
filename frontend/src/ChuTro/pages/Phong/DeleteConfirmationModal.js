import "../../Css/Phong/DeleteConfirmationModal.css";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  tenPhong,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>⚠️ Xác nhận xóa</h3>
        <p>
          Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phòng{" "}
          <b>{tenPhong}</b> không?
        </p>
        <div className="modal-actions">
          <button
            className="action-btn delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Đang xóa..." : "🗑️ Xóa"}
          </button>
          <button
            className="action-btn cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
