import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [productStock, setProductStock] = useState({});

  // Phần xử lý lấy dữ liệu
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setUserChecked(true);
  }, []);
  

  // Phần xử lý dữ liệu
  useEffect(() => {
    const fetchQuantities = async () => {
      try {
        const responses = await Promise.all(
          cartItems.map((item) =>
            axios.get(`http://localhost:8081/api/products/${item.id}`)
          )
        );
        const stockData = {};
        responses.forEach((res) => {
          stockData[res.data.id] = res.data.quantity; // quantity là số còn lại
        });
        setProductStock(stockData);
      } catch (err) {
        console.error("Lỗi khi lấy tồn kho:", err);
      }
    };

    if (cartItems.length > 0) {
      fetchQuantities();
    }
  }, [cartItems]);

  // Phần xử lý 
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (productId, value) => {
    const newValue = Math.max(1, parseInt(value) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newValue } : item
      )
    );
  };
  
  // Phần xử lý tăng sp
  const handleIncrement = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  
  // Phần xử lý giảm sp
  const handleDecrement = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };
  
  // Phần xử lý xóa sp
  const handleRemove = (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Phần thông báo không đủ sp
  const handleCheckout = () => {
    const outOfStock = cartItems.find(
      (item) => item.quantity > (productStock[item.id] ?? 0)
    );
    if (outOfStock) {
      alert(
        `Vượt quá số lượng còn lại!`
      );
      return;
    }
    navigate("/thanh-toan");
  };

  if (!userChecked) return null;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Giỏ Hàng</h2>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Hình</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: "80px" }}>
                      <Link to={`/san-pham/${item.id}`}>
                        <img
                          src={`/assets/Logo/${item.image}`}
                          alt={item.name}
                          style={{ width: "60px" }}
                          onError={(e) => {
                            e.target.src = "/assets/Logo/default.png";
                          }}
                        />
                      </Link>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price.toLocaleString()}đ</td>
                    <td>
                      <div className="input-group" style={{ width: "130px" }}>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleDecrement(item.id)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleIncrement(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <div className="d-flex flex-column mt-1">
                        <small className="text-muted">
                          Còn lại: {productStock[item.id] ?? "?"}
                        </small>
                        {item.quantity > (productStock[item.id] ?? 0) && (
                          <small className="text-danger">
                            Vượt quá số lượng còn lại!
                          </small>
                        )}
                      </div>

                    </td>
                    <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <h4 className="mb-3">Tổng cộng: {total.toLocaleString()}đ</h4>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
