// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./KhachThue/TrangChu";
import DangNhap from "./KhachThue/DangNhap";
import ChuTro from "./ChuTro/TrangChu";
import ThemPhong from "./ChuTro/ThemPhong";
import ChiTietPhong from "./ChuTro/ChiTietPhong";
import DichVu from "./ChuTro/DichVu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/dang-nhap" element={<DangNhap />} />
        <Route path="/chu-tro" element={<ChuTro />} />
        <Route path="/them-phong" element={<ThemPhong />} />
        <Route path="/phong/:id" element={<ChiTietPhong />} />
        <Route path="/dich-vu" element={<DichVu />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
