// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Giả sử token được lưu trong localStorage sau khi login
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu chưa có token thì chuyển về trang login
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu có token thì cho phép vào
  return children;
};

export default PrivateRoute;
