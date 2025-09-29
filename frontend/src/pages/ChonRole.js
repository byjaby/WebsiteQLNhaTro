import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import RoleOptions from "../components/RoleOptions";

function ChonRole() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("nguoi_thue");
  const [tenTro, setTenTro] = useState("");
  const [diaChiNhaTro, setDiaChiNhaTro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const payload = {
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      googleId: searchParams.get("googleId"),
      role,
    };

    // Nếu là chủ trọ thì cần thêm 2 field
    if (role === "chu_tro") {
      if (!tenTro || !diaChiNhaTro) {
        alert("Vui lòng nhập Tên trọ và Địa chỉ nhà trọ!");
        return;
      }
      payload.tenTro = tenTro;
      payload.diaChiNhaTro = diaChiNhaTro;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/google/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Đăng ký thành công!");

        // 👉 Điều hướng theo role
        if (data.user.role === "chu_tro") {
          navigate("/chu-tro", { state: { user: data.user } });
        } else {
          navigate("/", { state: { user: data.user } });
        }
      } else {
        alert(data.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="role-page">
      <h2>Chọn vai trò của bạn</h2>
      <RoleOptions role={role} setRole={setRole} />

      {role === "chu_tro" && (
        <div className="chu-tro-extra">
          <div className="form-row">
            <label>Tên trọ</label>
            <input
              type="text"
              placeholder="Nhập tên trọ..."
              value={tenTro}
              onChange={(e) => setTenTro(e.target.value)}
              className="input-inline"
            />
          </div>

          <div className="form-row">
            <label>Địa chỉ nhà trọ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ nhà trọ..."
              value={diaChiNhaTro}
              onChange={(e) => setDiaChiNhaTro(e.target.value)}
              className="input-inline"
            />
          </div>
        </div>
      )}

      <div className="button">
        <button onClick={handleSubmit}>Xác nhận</button>
      </div>
    </div>
  );
}

export default ChonRole;
