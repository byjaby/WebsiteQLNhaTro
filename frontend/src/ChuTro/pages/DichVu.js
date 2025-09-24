import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/DichVu.css";

function DichVu() {
  const [dichVuList, setDichVuList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    tenDichVu: "",
    donVi: "",
    donGia: "",
    moTa: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const chuTroId = location.state?.chuTroId;

  useEffect(() => {
    if (!chuTroId) {
      navigate("/"); // nếu không có id thì quay về trang chủ
      return;
    }

    fetch(`http://localhost:5000/api/dichvu/${chuTroId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 Data dịch vụ từ API:", data);
        setDichVuList(data);
      })
      .catch((err) => console.error("Lỗi khi load dịch vụ:", err));
  }, [chuTroId, navigate]);

  // Xử lý thêm dịch vụ
  const handleAddService = async () => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const parsedUser = JSON.parse(savedUser);

    if (
      !newService.tenDichVu ||
      !newService.donVi ||
      newService.donGia == null ||
      newService.donGia === ""
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/dichvu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          chuTroId: parsedUser.id,
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setDichVuList([...dichVuList, added]);
        setNewService({ tenDichVu: "", donVi: "", donGia: "", moTa: "" });

        // ✅ Thông báo thành công
        alert("Thêm dịch vụ thành công!");
      } else {
        const errData = await res.json();
        alert("Lỗi: " + (errData.error || "Không thể thêm dịch vụ"));
      }
    } catch (err) {
      console.error("Lỗi thêm dịch vụ:", err);
      alert("Đã xảy ra lỗi khi thêm dịch vụ!");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id, tenDichVu) => {
    if (tenDichVu === "Điện" || tenDichVu === "Nước") {
      alert("Không thể xóa dịch vụ mặc định: " + tenDichVu);
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/dichvu/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDichVuList(dichVuList.filter((dv) => dv._id !== id));
        alert(`Đã xóa dịch vụ`);
      } else {
        alert("Xóa dịch vụ thất bại!");
      }
    } catch (err) {
      console.error("Lỗi xóa dịch vụ:", err);
      alert("Có lỗi xảy ra khi xóa dịch vụ!");
    }
  };

  // Xử lý cập nhật
  const handleSaveEdit = async (id, updatedService) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dichvu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      });

      if (res.ok) {
        const data = await res.json(); // lấy dữ liệu update từ server

        setDichVuList(dichVuList.map((dv) => (dv._id === id ? data : dv)));
        setEditingId(null);

        alert("Cập nhật dịch vụ thành công ✅"); // 🔔 thông báo
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
    <div className="dichvu-container">
      <h2>Danh sách dịch vụ</h2>

      {/* Form thêm dịch vụ */}
      <div className="add-service-form">
        <input
          type="text"
          placeholder="Tên dịch vụ"
          value={newService.tenDichVu}
          onChange={(e) =>
            setNewService({ ...newService, tenDichVu: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Đơn vị"
          value={newService.donVi}
          onChange={(e) =>
            setNewService({ ...newService, donVi: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Đơn giá"
          value={newService.donGia ?? ""}
          onChange={(e) => {
            let value = e.target.value;

            // Bỏ dấu chấm và dấu phẩy ngăn cách hàng ngàn
            value = value.replace(/[.,\s]/g, "");

            setNewService({
              ...newService,
              donGia: value ? Number(value) : null,
            });
          }}
        />

        <input
          type="text"
          placeholder="Mô tả"
          value={newService.moTa}
          onChange={(e) =>
            setNewService({ ...newService, moTa: e.target.value })
          }
        />
        <button onClick={handleAddService}>➕ Thêm</button>
      </div>

      {/* Bảng dịch vụ */}
      <table className="dichvu-table">
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Đơn vị</th>
            <th>Đơn giá (VNĐ)</th>
            <th>Mô tả</th>

            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dichVuList.length > 0 ? (
            dichVuList.map((dv) => (
              <tr key={dv._id}>
                <td>
                  {editingId === dv._id ? (
                    <input
                      value={dv.tenDichVu}
                      disabled={
                        dv.tenDichVu === "Điện" || dv.tenDichVu === "Nước"
                      }
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
                        let value = e.target.value;

                        // bỏ hết dấu chấm hoặc dấu phẩy phân tách ngàn
                        value = value.replace(/[.,]/g, "");

                        setDichVuList(
                          dichVuList.map((item) =>
                            item._id === dv._id
                              ? {
                                  ...item,
                                  donGia: value ? Number(value) : null,
                                }
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
                            item._id === dv._id
                              ? { ...item, moTa: e.target.value }
                              : item
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
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingId(dv._id)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(dv._id)}
                      >
                        🗑️ Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Chưa có dịch vụ nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DichVu;
