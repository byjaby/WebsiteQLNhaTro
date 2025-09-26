import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-easy-crop";
import "../Css/Profile.css";
import CloneHeader from "../components/CloneHeader";
import Footer from "../components/Footer";
import defaultAvatar from "../images/default-avatar.png";
import SuaThongTin from "../components/SuaThongTin";
import DoiMatKhau from "../components/DoiMatKhau";

function Profile() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // file gốc
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // tọa độ crop
  const [showCropper, setShowCropper] = useState(false);
  const [user, setUser] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [showEdit, setShowEdit] = useState(false);
  const [showChange, setShowChange] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // token lưu khi login
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi load user:", err);
        navigate("/dang-nhap"); // token lỗi => đá về login
      }
    };

    fetchUser();
  }, [navigate]);

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

  const handleCancelCrop = () => {
    setShowCropper(false);
    setSelectedImage(null);
    document.getElementById("avatarInput").value = ""; // reset input file
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

    const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);

    const formData = new FormData();
    formData.append("avatar", croppedBlob, "avatar.jpg");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/${user._id}/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // cập nhật user luôn trong state
      setUser(res.data.user);

      setShowCropper(false);
      alert("Cập nhật avatar thành công!");

      window.location.reload();
    } catch (err) {
      console.error("Upload thất bại:", err);
      alert("Có lỗi xảy ra khi upload avatar!");
    }
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <CloneHeader user={user} onLogout={handleLogout} />

      <div className="tenant-dashboard">
        {user.role === "nguoi_thue" ? (
          <main className="tenant-main">
            <div className="room-info-card">
              <div className="profile-grid-2cols">
                {/* Cột trái: avatar + thông tin cá nhân */}
                <div className="left-column">
                  <h2>Thông tin cá nhân</h2>

                  <div>
                    <div className="avatar-wrapper">
                      <div className="avatar-section">
                        <img
                          src={
                            user?.avatar
                              ? `http://localhost:5000${
                                  user.avatar
                                }?t=${Date.now()}`
                              : defaultAvatar
                          }
                          alt="Avatar"
                          className="avatar-image"
                        />

                        {/* Overlay hiện khi hover */}
                        <div
                          className="avatar-overlay"
                          onClick={() =>
                            document.getElementById("avatarInput").click()
                          }
                        >
                          📷
                        </div>

                        {/* Input file ẩn */}
                        <input
                          id="avatarInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="avatar-input"
                        />
                      </div>

                      {/* chữ nằm dưới avatar */}
                      <p className="avatar-label">Hình đại diện</p>
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
                          <button onClick={handleCancelCrop}>❌ Hủy</button>
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
                      {user.ngaySinh
                        ? new Date(user.ngaySinh).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"}
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
                        onClick={() => setShowEdit(true)}
                      >
                        ✏️ Cập nhật thông tin
                      </button>

                      {showEdit && (
                        <SuaThongTin
                          user={user}
                          onClose={() => setShowEdit(false)}
                          onUpdated={(newUser) => setUser(newUser)}
                        />
                      )}

                      {/* ✅ chỉ hiển thị nếu user không có googleId */}
                      {!user.googleId && (
                        <>
                          <button
                            className="action-button"
                            onClick={() => setShowChange(true)}
                          >
                            🔑 Đổi mật khẩu
                          </button>

                          {showChange && (
                            <DoiMatKhau
                              user={user}
                              onClose={() => setShowChange(false)}
                              onUpdated={(newUser) => setUser(newUser)}
                            />
                          )}
                        </>
                      )}
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
