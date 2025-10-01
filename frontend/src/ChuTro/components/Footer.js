import "../Css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Giới thiệu */}
        <div className="footer-section">
          <h4 className="footer-title">
            <span className="footer-logo">🏢</span> Nhà Trọ Online
          </h4>
          <p className="footer-description">
            Nền tảng tìm kiếm phòng trọ hàng đầu, kết nối chủ nhà và người thuê
            một cách nhanh chóng và tiện lợi.
          </p>
        </div>

        {/* Liên hệ */}
        <div className="footer-section">
          <h4 className="footer-title">Liên hệ</h4>
          <div className="contact-info">
            <p>📞 Hotline: 1900 1234</p>
            <p>📧 Email: info@nhatroonline.com</p>
            <p>📍 Địa chỉ: 123 Đường ABC, TP.HCM</p>
          </div>
        </div>

        {/* Hỗ trợ */}
        <div className="footer-section">
          <h4 className="footer-title">Hỗ trợ</h4>
          <ul className="footer-links">
            <li>
              <a href="#faq">Câu hỏi thường gặp</a>
            </li>
            <li>
              <a href="#guide">Hướng dẫn sử dụng</a>
            </li>
            <li>
              <a href="#policy">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="#terms">Điều khoản sử dụng</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2024 Nhà Trọ Online. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
