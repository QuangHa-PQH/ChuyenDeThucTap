import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8081/api/auth/login", {
      username,
      password,
    });

    console.log("Response data:", response.data);

    const token = response.data.token;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log("Decoded Payload:", decodedPayload);

    const usernameFromToken = decodedPayload.sub; // Lấy username từ token

    // Gán role dựa trên username
    const role = usernameFromToken === "admin" ? "ADMIN" : "USER";

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      alert("Đăng nhập thất bại, vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Sai tài khoản hoặc mật khẩu!");
  }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "400px" }}>
        <h4 className="text-center fw-bold">ĐĂNG NHẬP</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tài khoản"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: "#1D513C" }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
