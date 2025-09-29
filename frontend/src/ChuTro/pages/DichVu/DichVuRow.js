function DichVuRow({ dv, dichVuList, setDichVuList, editingId, setEditingId }) {
  const handleDelete = async (id, tenDichVu) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/dichvu/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDichVuList(dichVuList.filter((item) => item._id !== id));
        alert("Đã xóa dịch vụ!");
      } else {
        alert("Xóa dịch vụ thất bại!");
      }
    } catch (err) {
      console.error("Lỗi xóa dịch vụ:", err);
      alert("Có lỗi xảy ra khi xóa dịch vụ!");
    }
  };

  const handleSaveEdit = async (id, updatedService) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dichvu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      });

      if (res.ok) {
        const data = await res.json();
        setDichVuList(
          dichVuList.map((item) => (item._id === id ? data : item))
        );
        setEditingId(null);
        alert("Cập nhật dịch vụ thành công ✅");
      } else {
        const errData = await res.json();
        alert("Cập nhật thất bại: " + errData.error);
      }
    } catch (err) {
      console.error("Lỗi cập nhật dịch vụ:", err);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  return (
    <tr>
      <td>
        {editingId === dv._id ? (
          <input
            value={dv.tenDichVu}
            disabled={dv.tenDichVu === "Điện" || dv.tenDichVu === "Nước"}
            onChange={(e) =>
              setDichVuList(
                dichVuList.map((item) =>
                  item._id === dv._id
                    ? { ...item, tenDichVu: e.target.value }
                    : item
                )
              )
            }
          />
        ) : (
          dv.tenDichVu
        )}
      </td>
      <td>
        {editingId === dv._id ? (
          <input
            value={dv.donVi}
            onChange={(e) =>
              setDichVuList(
                dichVuList.map((item) =>
                  item._id === dv._id
                    ? { ...item, donVi: e.target.value }
                    : item
                )
              )
            }
          />
        ) : (
          dv.donVi
        )}
      </td>
      <td>
        {editingId === dv._id ? (
          <input
            type="text"
            value={dv.donGia ?? ""}
            onChange={(e) => {
              let value = e.target.value.replace(/[.,]/g, "");
              setDichVuList(
                dichVuList.map((item) =>
                  item._id === dv._id
                    ? { ...item, donGia: value ? Number(value) : null }
                    : item
                )
              );
            }}
          />
        ) : dv.donGia != null ? (
          `${dv.donGia.toLocaleString()} VND`
        ) : (
          "—"
        )}
      </td>
      <td>
        {editingId === dv._id ? (
          <input
            value={dv.moTa}
            onChange={(e) =>
              setDichVuList(
                dichVuList.map((item) =>
                  item._id === dv._id ? { ...item, moTa: e.target.value } : item
                )
              )
            }
          />
        ) : (
          dv.moTa
        )}
      </td>
      <td>
        {editingId === dv._id ? (
          <>
            <button
              className="save-btn"
              onClick={() => handleSaveEdit(dv._id, dv)}
            >
              💾 Lưu
            </button>
            <button className="cancel-btn" onClick={() => setEditingId(null)}>
              ❌ Hủy
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setEditingId(dv._id)}>
              ✏️ Sửa
            </button>
            {dv.tenDichVu !== "Điện" && dv.tenDichVu !== "Nước" && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(dv._id, dv.tenDichVu)}
              >
                🗑️ Xóa
              </button>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

export default DichVuRow;
