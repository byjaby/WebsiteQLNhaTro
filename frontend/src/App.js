import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./KhachThue/pages/TrangChu";
import DangNhap from "./pages/DangNhap";
import ChuTro from "./ChuTro/pages/TrangChu";
import ThemPhong from "./ChuTro/pages/Phong/ThemPhong";
import ChiTietPhong from "./ChuTro/pages/Phong/ChiTietPhong";
import DichVu from "./ChuTro/pages/DichVu/DichVu";
import TTCN from "./ChuTro/pages/TTCN/TTCN";
import QuenMK from "./pages/QuenMK";
import Profile from "./KhachThue/pages/Profile";
import ThongTinTro from "./KhachThue/pages/ThongTinTro";
import ChonRole from "./pages/ChonRole";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
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
          <Route path="/thong-tin-tro/:slug" element={<ThongTinTro />} />
          <Route path="/chon-role" element={<ChonRole />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
