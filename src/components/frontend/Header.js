import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Topbar */}
      <div className="bg-primary text-white py-2">
        <div className="container d-flex justify-content-between small">
          <div>
            <a href="#" className="text-white me-3 text-decoration-none">ĐĂNG KÝ</a>
            <a href="#" className="text-white text-decoration-none">ĐĂNG NHẬP</a>
          </div>
          <div>
            <span>📧 quangha@gmail.com</span> | <span>📞 1234 5678</span>
          </div>
        </div>
      </div>

      {/* Logo + Tìm kiếm + Giỏ hàng */}
      <div className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="text-white fs-3 fw-bold text-decoration-none">
            HA<span className="text-info">SHOP</span>
          </Link>

          {/* Tìm kiếm */}
          <div className="input-group w-50">
            <input type="text" className="form-control" placeholder="Tìm kiếm..." />
            <button className="btn btn-primary">🔍</button>
          </div>

          {/* Giỏ hàng + Yêu thích */}
          <div className="d-flex align-items-center gap-3">
            <span>🤍</span>
            <button className="btn btn-danger">🛒 (0) sản phẩm</button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="bg-primary border-top border-bottom">
        <div className="container d-flex position-relative">
          <Link to="/" className="nav-link fw-bold text-light py-3 px-3 border-bottom border-success">Trang chủ</Link>
          <Link to="/gioi-thieu" className="nav-link text-light py-3 px-3">Giới thiệu</Link>

          {/* Dropdown Sản phẩm */}
          <div className="nav-item dropdown-hover position-relative">
            <Link to="/tat-ca-san-pham" className="nav-link text-light py-3 px-3">Sản phẩm</Link>
            <div className="dropdown-menu-custom position-absolute bg-dark shadow-sm">
              <Link to="/tivi" className="dropdown-item text-light px-3 py-2">Tivi</Link>
              <Link to="/tu-lanh" className="dropdown-item text-light px-3 py-2">Tủ lạnh</Link>
              <Link to="/may-giat" className="dropdown-item text-light px-3 py-2">Máy giặt</Link>
            </div>
          </div>

          <Link to="/tin-tuc" className="nav-link text-light py-3 px-3">Tin tức</Link>
          <Link to="/lien-he" className="nav-link text-light py-3 px-3">Liên hệ</Link>
        </div>
      </nav>

    </header>
  );
};

export default Header;
