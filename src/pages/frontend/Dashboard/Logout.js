// Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa thông tin người dùng và token khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Chuyển hướng về trang login
    navigate("/");
    window.location.reload(); // Tự động load lại trang
  }, [navigate]);

  return <div>Đang đăng xuất...</div>;
};

export default Logout;
