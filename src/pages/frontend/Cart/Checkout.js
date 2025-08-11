import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4); // 0 -> 1 -> 2 -> 3 -> 0
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  useEffect(() => {
    localStorage.removeItem("vnpayProcessed");
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get("buynow") === "true";
    const cartData = isBuyNow
      ? localStorage.getItem("tempCart")
      : localStorage.getItem("cart");

    if (cartData) setCartItems(JSON.parse(cartData));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      setCustomerInfo((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
        email: parsedUser.email || "",
      }));
    }
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const validateInfo = () => {
    const phoneRegex = /^0\d{9}$/;
    const newErrors = {};

    if (!customerInfo.name) newErrors.name = "Vui lòng nhập họ tên.";
    if (!customerInfo.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(customerInfo.phone)) {
      newErrors.phone = "Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số.";
    }
    if (!customerInfo.address) newErrors.address = "Vui lòng nhập địa chỉ giao hàng.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateInfo()) return;
  
    setIsProcessing(true);

    const payload = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      deliveryAddress: customerInfo.address,
      totalAmount: total,
      note: customerInfo.note,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };
  
    try {
      if (paymentMethod === "COD") {
        await axios.post("http://localhost:8081/api/orders", payload);
        localStorage.removeItem("cart");
        alert("Đặt hàng thành công!");
        navigate("/");
      } else if (paymentMethod === "CARD") {
        localStorage.setItem("vnpayOrderPayload", JSON.stringify(payload)); //  Lưu tạm đơn hàng
        const res = await axios.post("http://localhost:8081/api/payment/vnpay", payload);
        const vnpayUrl = res.data;
        window.location.href = vnpayUrl; //  Chuyển hướng đến VNPay
      }
      
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra khi xử lý đơn hàng.");
    } finally {
      setIsProcessing(false);
    }
  };
    
  return (
    <div className="container py-5">
      <h2>Thanh Toán</h2>

      {cartItems.length === 0 ? (
        <p>Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <div className="row">
          <div className="col-md-6 mb-4">
            <h4>Thông tin người nhận</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={customerInfo.phone}
                  maxLength={10}
                  pattern="0[0-9]{9}"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCustomerInfo({ ...customerInfo, phone: value });
                    }
                  }}
                />
                {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Nhập Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ giao hàng</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="2"
                  value={customerInfo.address}
                  onChange={handleChange}
                ></textarea>
                {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Ghi chú (Có thể bỏ qua)</label>
                <textarea
                  className="form-control"
                  name="note"
                  rows="2"
                  value={customerInfo.note}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Phương thức thanh toán</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <label className="form-check-label">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                    />
                    <label className="form-check-label">Thanh toán bằng thẻ</label>
                  </div>
                </div>
              </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}>
                  {/* {paymentMethod === "COD" ? "Đặt hàng COD" : "Thanh toán VNPay"} */}
                  {isProcessing
                    ? "Đang xử lý..."
                    : paymentMethod === "COD"
                    ? "Đặt hàng COD"
                    : "Thanh toán VNPay"}
                </button>

            </form>
          </div>

          <div className="col-md-6">
            <h4>Đơn hàng của bạn</h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={`/assets/Logo/${item.image}`}
                      alt={item.name}
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      onError={(e) => (e.target.src = "/assets/Logo/default.png")}
                    />
                    <div>
                      {item.name} <strong>x{item.quantity}</strong>
                    </div>
                  </div>
                  <div>{(item.price * item.quantity).toLocaleString()}đ</div>
                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between">
                <strong>Tổng cộng</strong>
                <strong>{total.toLocaleString()}đ</strong>
              </li>
            </ul>
          </div>
          
        </div>
      )}

      {isProcessing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <div className="text-center text-white">
            <h4>
              ✅ Đơn hàng đang được xử lý{'.'.repeat(dotCount)}
            </h4>
            <p>Vui lòng chờ trong giây lát.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
