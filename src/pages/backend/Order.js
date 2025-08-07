import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [trash] = useState([]);
  const [viewTrash] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);  // Thêm state để lưu đơn hàng đã chọn
  const [showDetailModal, setShowDetailModal] = useState(false);  // Thêm state để hiển thị modal

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.table(response.data);  // Xem thông tin trả về từ API
      setOrders(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Cập nhật lại danh sách sau khi xóa
      setOrders(orders.filter((o) => o.id !== orderId));
      alert("Hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Xảy ra lỗi khi xóa đơn hàng.");
    }
  };
  

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Đã giao" ? "Đang xử lý" : "Đã giao";
    console.log(`Đang gửi yêu cầu đổi trạng thái: ${currentStatus} -> ${newStatus}`);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8081/api/orders/${id}/status?status=${encodeURIComponent(newStatus)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Phản hồi từ server:", response.data);

      // Cập nhật lại state
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };
  
  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8081/api/order-details/order/${order.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Chi tiết đơn hàng:", response.data);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      setOrderDetails([]); // fallback để không bị undefined
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);  // Đóng modal
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác đơn hàng' : 'Danh sách đơn hàng'}</h4>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người đặt hàng</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Địa chỉ giao</th>
            <th>Ghi chú</th>
            <th>Chi tiết</th>            
            <th>Ngày đặt hàng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {(viewTrash ? trash : orders).map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.customerPhone}</td>
              <td>{o.customerEmail}</td>
              <td>{o.deliveryAddress}</td>
              <td>{o.note}</td>
              <th>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleViewDetails(o)}>Chi tiết</button>
              </th>
              <td>{new Date(o.orderDate).toLocaleDateString('vi-VN')}</td>
              <td className="d-flex gap-1">
                {!viewTrash && (
                  <>
                    <button
                      className={`btn btn-sm ${o.status === "Đã giao" ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => toggleStatus(o.id, o.status)}
                    >
                      {o.status}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteOrder(o.id)}
                    >
                      Hủy Đơn
                    </button>
                  </>
                )}
              </td>              
            </tr>
          ))}
          {(viewTrash ? trash : orders).length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">Không có đơn hàng</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && selectedOrder && (
        <div className="modal show" style={{ display: 'block' }} onClick={closeDetailModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết đơn hàng #{selectedOrder.id}</h5>
                <button type="button" className="btn-close" onClick={closeDetailModal}></button>
              </div>
              <div className="modal-body">
              <h5>Chi tiết sản phẩm:</h5>
              {Array.isArray(orderDetails) && orderDetails.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Mã CTDH</th>
                      <th>Mã sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá sản phẩm</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id || "Không có CTDH"}</td>
                        <td>{item.productId || "Không có mã sản phẩm"}</td>
                        <td>{item.quantity}</td>
                        <td>{(item.unitPrice || 0).toLocaleString()}đ</td>
                        <td>{(item.totalPrice || 0).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có chi tiết sản phẩm</p>
              )}

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDetailModal}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Order;
