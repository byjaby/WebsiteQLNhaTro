// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./KhachThue/pages/TrangChu";
import DangNhap from "./pages/DangNhap";
import ChuTro from "./ChuTro/pages/TrangChu";
import ThemPhong from "./ChuTro/pages/ThemPhong";
import ChiTietPhong from "./ChuTro/pages/ChiTietPhong";
import DichVu from "./ChuTro/pages/DichVu";
import TTCN from "./ChuTro/pages/TTCN";
import QuenMK from "./pages/QuenMK";
import Profile from "./KhachThue/pages/Profile";

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
        <Route path="/ttcn" element={<TTCN />} />
        <Route path="/quen-mat-khau" element={<QuenMK />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
