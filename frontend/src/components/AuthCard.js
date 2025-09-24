import React from "react";
import "../Css/AuthCard.css";

const AuthCard = ({ children }) => {
  return (
    <div className="auth-card-wrapper">
      <div className="auth-card">{children}</div>
      <div className="floating-element floating-element-1"></div>
      <div className="floating-element floating-element-2"></div>
    </div>
  );
};

export default AuthCard;
