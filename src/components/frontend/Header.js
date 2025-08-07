import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaPhoneAlt, FaRegHeart, FaRegUserCircle } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "./SearchBar"
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
  

      // Nếu user bị lưu là "undefined" (string)
      if (storedUser === "undefined") {
        localStorage.removeItem("user");
        setUser(null);
        return;
      }

      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);
    } catch (error) {
      console.error("Lỗi khi đọc user từ localStorage:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  };


  loadUser();

  window.addEventListener("focus", loadUser);

  return () => {
    window.removeEventListener("focus", loadUser);

  };
}, []);


  return (
    <header className="sticky-header">
      {/* Top Header */}
      <div style={{ backgroundColor: "#000000ff" }} className="py-4 text-white">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="col-md-3">
            <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
              Ha<span style={{color: "#00b7ffff"}}>Shop</span>
            </Link>
          </div>

          {/* Search */}
          <div className="col-md-4">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <div className="col-md-6">
                <Link to="/cart" className="text-white text-decoration-none ms-3">
                  <TiShoppingCart size={25} /> Giỏ hàng
                </Link>
                <Link to="/yeu-thich" className="text-white text-decoration-none ms-4">
                  <FaRegHeart size={22} /> Yêu thích
                </Link>
              </div>
              
              <div className="col-md-6">
                {user ? (
                  user.role.includes("ROLE_USER") ? (
                    <Link className="text-white text-decoration-none" to="/customer">
                      <FaRegUserCircle size={25} className="me-2" />
                      Xin chào ({user.name})
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="text-white text-decoration-none">
                        <FaUser className="me-1" /> Đăng nhập
                      </Link>
                      <Link to="/register" className="text-white text-decoration-none ms-4">
                        Đăng ký
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    <Link to="/login" className="text-white text-decoration-none">
                      <FaUser className="me-1" /> Đăng nhập
                    </Link>
                    <Link to="/register" className="text-white text-decoration-none ms-4">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Menu dưới */}
      <nav style={{ backgroundColor: "#45bfef5a" }}>
        <div className="container d-flex justify-content-between align-items-center position-relative">
          <div className="d-flex">
            <Link className="nav-link py-3 px-3 text-dark" to="/">Trang chủ</Link>
            <Link className="nav-link py-3 px-3 text-dark" to="/gioi-thieu">Giới thiệu</Link>

            {/* Dropdown Sản phẩm */}
            <div
              className="position-relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <Link className="nav-link py-3 px-3 text-dark" to="/tat-ca-san-pham">Sản phẩm</Link>
              {showDropdown && (
                <div
                  className="position-absolute bg-white shadow rounded p-2"
                  style={{
                    top: '100%',
                    left: 0,
                    minWidth: '180px',
                    zIndex: 1000,
                  }}
                >
                  <Link className="dropdown-item py-2 px-3 text-dark text-decoration-none" to="/tivi">Tivi</Link>
                  <Link className="dropdown-item py-2 px-3 text-dark text-decoration-none" to="/tu-lanh">Tủ lạnh</Link>
                  <Link className="dropdown-item py-2 px-3 text-dark text-decoration-none" to="/may-giat">Máy giặt</Link>
                  <Link className="dropdown-item py-2 px-3 text-dark text-decoration-none" to="/may-lanh">Máy lạnh</Link>
                </div>
              )}
            </div>

            <Link className="nav-link py-3 px-3 text-dark" to="/tin-tuc">Tin tức</Link>
            <Link className="nav-link py-3 px-3 text-dark" to="/lien-he">Liên hệ</Link>
          </div>
          {/* Hotline */}
          <div className="fw-bold d-none d-md-block">
            <FaPhoneAlt className="me-1" />
            Hotline: 1900 6750
          </div>
        </div>
      </nav>      
    </header>
  );
};

export default Header;
