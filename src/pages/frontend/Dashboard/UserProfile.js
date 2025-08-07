import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:8081/api/orders/user/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Lỗi khi lấy đơn hàng:", err));
    }
  }, [user]);

  if (!user || !user.role.includes("ROLE_USER")) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <h4 className="text-center">Thông tin người dùng</h4>
          <div className="list-group">
            <div className="list-group-item"><strong>Tên người dùng:</strong> {user.name}</div>
            <div className="list-group-item"><strong>Email:</strong> {user.email}</div>
            <div className="list-group-item"><strong>SĐT:</strong> {user.phone}</div>
          </div>

          <div className="mt-4 text-center">
            <button className="btn btn-outline-primary me-2" onClick={() => setShowOrders(true)}>
              Xem đơn hàng
            </button>
            <Link to="/logout" className="btn btn-danger">Đăng xuất</Link>
          </div>
        </div>
      </div>

      {/* Modal đơn hàng */}
      {showOrders && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Đơn hàng của bạn</h5>
                <button className="btn-close" onClick={() => setShowOrders(false)}></button>
              </div>
              <div className="modal-body">
                {orders.length === 0 ? (
                  <p>Không có đơn hàng nào.</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.status}</td>
                          <td>{order.totalAmount.toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowOrders(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
