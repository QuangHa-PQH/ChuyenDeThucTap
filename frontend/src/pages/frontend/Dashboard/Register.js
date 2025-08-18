import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Sử dụng useNavigate thay vì useHistory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không trùng khớp!");
      return;
    }

    const newUser = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };

    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.status >= 200 && response.status < 300) {
        // Nếu đăng ký thành công (dù không có body) ➔ chuyển login
        navigate("/login");
      } else {
        // Nếu có lỗi, cố đọc body (nếu có)
        try {
          const errorData = await response.json();
          setError(errorData.message || "Đăng ký không thành công!");
        } catch (err) {
          setError("Đăng ký không thành công!");
        }
      }
    } catch (error) {
      setError("Lỗi kết nối, vui lòng thử lại!");
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "450px" }}>
        <h4 className="text-center fw-bold">ĐĂNG KÝ</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#1D513C" }}>
            Đăng ký
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-center text-muted mb-4">
            Nếu bạn đã có tài khoản, <Link to="/login" className="text-decoration-none">đăng nhập tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
