import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu chưa đăng nhập thì về trang login
    return <Navigate to="/admin/login" replace />;
  }

  // Đã đăng nhập thì cho phép hiển thị
  return children;
};

export default PrivateRoute;

