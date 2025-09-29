import React from "react";

function TTCNEdit({ user, formData, setFormData, setIsEditing, handleUpdate }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="ttcn-form" onSubmit={handleUpdate}>
      <label>
        Họ tên:
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Ngày sinh:
        <input
          type="text"
          name="ngaySinh"
          value={formData.ngaySinh || ""}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Số điện thoại:
        <input
          type="text"
          name="soDienThoai"
          value={formData.soDienThoai || ""}
          onChange={handleChange}
          required
        />
      </label>

      {user.tenTro !== undefined && (
        <label>
          Tên trọ:
          <input
            type="text"
            name="tenTro"
            value={formData.tenTro || ""}
            onChange={handleChange}
          />
        </label>
      )}

      {user.diaChiNhaTro !== undefined && (
        <label>
          Địa chỉ nhà trọ:
          <input
            type="text"
            name="diaChiNhaTro"
            value={formData.diaChiNhaTro || ""}
            onChange={handleChange}
          />
        </label>
      )}

      <div className="form-actions">
        <button type="submit" className="save-btn">
          💾 Lưu
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsEditing(false)}
        >
          ❌ Hủy
        </button>
      </div>
    </form>
  );
}

export default TTCNEdit;
