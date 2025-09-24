import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-easy-crop";
import "../Css/Profile.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import defaultAvatar from "../images/default-avatar.png";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // file gốc
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // tọa độ crop
  const [croppedImage, setCroppedImage] = useState(null); // ảnh sau khi crop
  const [showCropper, setShowCropper] = useState(false);
  const [user, setUser] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Lấy user từ Link state khi vào trang Profile
  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    }
  }, [location.state]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!user) {
    return <p>Không tìm thấy thông tin người dùng</p>;
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/dang-nhap");
  };

  const handleUpdateInfo = () => {
    navigate("/cap-nhat-thong-tin", { state: { user } });
  };

  const handleChangePassword = () => {
    navigate("/doi-mat-khau", { state: { userId: user._id } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result); // base64 ảnh gốc
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // Hàm tạo ảnh đã crop từ canvas
  const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    // Lấy blob từ ảnh crop
    const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);

    // Preview tạm
    const previewUrl = URL.createObjectURL(croppedBlob);
    setCroppedImage(previewUrl);

    // Gửi lên server
    const formData = new FormData();
    formData.append("avatar", croppedBlob, "avatar.jpg");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/${user._id}/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser({ ...user, avatar: res.data.avatarUrl });
      setShowCropper(false);
    } catch (err) {
      console.error("Upload thất bại:", err);
    }
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      <div className="tenant-dashboard">
        {user.role === "nguoi_thue" ? (
          <main className="tenant-main">
            <div className="room-info-card">
              <div className="profile-grid-2cols">
                {/* Cột trái: avatar + thông tin cá nhân */}
                <div className="left-column">
                  <h2>Thông tin cá nhân</h2>

                  <div>
                    <div className="avatar-section">
                      <img
                        src={
                          user.avatar
                            ? `data:image/jpeg;base64,${user.avatar}`
                            : croppedImage || defaultAvatar
                        }
                        alt="Avatar"
                        className="avatar-image"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>

                    {showCropper && (
                      <div className="cropper-modal">
                        <div className="cropper-container">
                          <Cropper
                            image={selectedImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // avatar vuông
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        </div>

                        <div className="cropper-actions">
                          <button onClick={handleSave}>✅ Lưu ảnh</button>
                          <button onClick={() => setShowCropper(false)}>
                            ❌ Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="info-section">
                    <p>
                      <strong>Họ và tên:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Ngày sinh:</strong>{" "}
                      {user.ngaySinh || "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email || "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong>{" "}
                      {user.soDienThoai || "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {user.diaChi || "Chưa cập nhật"}
                    </p>

                    <div className="profile-actions">
                      <button
                        className="action-button"
                        onClick={handleUpdateInfo}
                      >
                        ✏️ Cập nhật thông tin
                      </button>
                      <button
                        className="action-button"
                        onClick={handleChangePassword}
                      >
                        🔑 Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột phải: thông tin trọ */}
                <div className="right-column">
                  <h2>Thông tin trọ</h2>
                  {user.room ? (
                    <>
                      <p>
                        <strong>Tên trọ:</strong> {user.room.tenTro}
                      </p>
                      <p>
                        <strong>Chủ trọ:</strong> {user.room.chuTro}
                      </p>
                      <p>
                        <strong>Số phòng đang ở:</strong> {user.room.soPhong}
                      </p>
                      <p>
                        <strong>Giá tiền:</strong>{" "}
                        {user.room.giaTien.toLocaleString("vi-VN")} đ/tháng
                      </p>
                      <p>
                        <strong>Địa chỉ trọ:</strong> {user.room.diaChiNhaTro}
                      </p>
                    </>
                  ) : (
                    <p>Bạn chưa đăng ký ở trọ</p>
                  )}
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Thao tác nhanh</h3>
              <div className="actions-grid">
                <button className="action-button">📄 Xem hợp đồng</button>
                <button className="action-button">💬 Gửi phản hồi</button>
                <button className="action-button">
                  📜 Xem lịch sử đóng tiền
                </button>
              </div>
            </div>
          </main>
        ) : (
          <p>Bạn không phải là người thuê</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
