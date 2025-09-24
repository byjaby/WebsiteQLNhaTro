import React from "react";
import { Github, Chrome } from "lucide-react";
import "../Css/SocialLogin.css";

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button
        className="social-button"
        onClick={() =>
          (window.location.href = "http://localhost:5000/api/auth/google")
        }
      >
        <Chrome size={20} />
        <span>Google</span>
      </button>

      <button className="social-button">
        <Github size={20} />
        <span>GitHub</span>
      </button>
    </div>
  );
};

export default SocialLogin;
