import React from "react";

function DoiMK({
  passwordData,
  setPasswordData,
  showPassword,
  setShowPassword,
  setIsChangingPassword,
  handlePasswordChange,
}) {
  return (
    <form className="ttcn-form" onSubmit={handlePasswordChange}>
      <label>
        Mật khẩu hiện tại:
        <input
          type={showPassword ? "text" : "password"}
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
          required
        />
      </label>
      <label>
        Mật khẩu mới:
        <input
          type={showPassword ? "text" : "password"}
          name="newPassword"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
          required
        />
      </label>
      <label>
        Xác nhận mật khẩu mới:
        <input
          type={showPassword ? "text" : "password"}
          name="confirmNewPassword"
          value={passwordData.confirmNewPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmNewPassword: e.target.value,
            })
          }
          required
        />
      </label>

      <div className="toggle-password">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-btn"
        >
          {showPassword ? "🙈 Ẩn mật khẩu" : "👁️ Hiện mật khẩu"}
        </button>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          💾 Đổi mật khẩu
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsChangingPassword(false)}
        >
          ❌ Hủy
        </button>
      </div>
    </form>
  );
}

export default DoiMK;
