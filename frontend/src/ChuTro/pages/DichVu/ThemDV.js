import "../../Css/DichVu/ThemDV.css";

function ThemDV({ newService, setNewService, dichVuList, setDichVuList }) {
  const handleAddService = async () => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const parsedUser = JSON.parse(savedUser);

    if (!newService.tenDichVu || !newService.donVi || !newService.donGia) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/dichvu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          chuTroId: parsedUser._id,
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setDichVuList([...dichVuList, added]);
        setNewService({ tenDichVu: "", donVi: "", donGia: "", moTa: "" });
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

  return (
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
          let value = e.target.value.replace(/[.,\s]/g, "");
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
        onChange={(e) => setNewService({ ...newService, moTa: e.target.value })}
      />
      <button onClick={handleAddService}>➕ Thêm</button>
    </div>
  );
}

export default ThemDV;
