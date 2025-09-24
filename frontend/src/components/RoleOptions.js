import React from "react";
import "../Css/RoleOptions.css"; // file CSS riêng

const RoleOptions = ({ role, setRole }) => {
  return (
    <div className="role-options">
      <label
        className={`role-card ${
          role === "nguoi_thue" ? "active nguoi-thue" : ""
        }`}
      >
        <input
          type="radio"
          name="role"
          value="nguoi_thue"
          checked={role === "nguoi_thue"}
          onChange={(e) => setRole(e.target.value)}
        />
        <span>Người thuê trọ</span>
      </label>

      <label
        className={`role-card ${role === "chu_tro" ? "active chu-tro" : ""}`}
      >
        <input
          type="radio"
          name="role"
          value="chu_tro"
          checked={role === "chu_tro"}
          onChange={(e) => setRole(e.target.value)}
        />
        <span>Chủ trọ</span>
      </label>
    </div>
  );
};

export default RoleOptions;
