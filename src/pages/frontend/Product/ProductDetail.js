import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {

    // Phần xử lý lấy dữ liệu
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8081/api/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        const relatedRes = await axios.get(
          `http://localhost:8081/api/products/category/${fetchedProduct.categoryId}?excludeId=${fetchedProduct.id}`
        );
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Phần xử lý tăng, giảm số lượng SP
  const handleQuantityInput = (e) => {
    const value = e.target.value;
  
    // Cho phép input rỗng hoặc số nguyên dương
    if (value === "") {
      setQuantity("");
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        setQuantity(parsed);
      }
    }
  };
  

  // Phần xử lý thêm giỏ hàng
  const handleAddToCart = () => {
    if (quantity > (product.quantity || 0)) {
      alert(`Vượt quá số lượng còn lại!`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      const newQty = cart[index].quantity + quantity;
      if (newQty > (product.quantity || 0)) {
        alert(`Vượt quá số lượng còn lại!`);
        return;
      }
      cart[index].quantity = newQty;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  // Phần xử lý nút mua hàng
  const handleBuyNow = () => {
    if (quantity > (product.quantity || 0)) {
      alert(`Vượt quá số lượng còn lại!`);
      return;
    }
    
    const tempCart = [{
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    }];

    localStorage.setItem("tempCart", JSON.stringify(tempCart));
    navigate("/thanh-toan?buynow=true");
  };

  // Phần hiển thị thông báo khi dữ liệu lỗi
  if (loading) {
    return <div className="text-center py-5">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-5">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-2" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <h2 className="mb-4 text-center"><b>CHI TIẾT SẢN PHẨM</b></h2>
      <div className="row align-items-start">
        <div className="col-md-6 mb-4">
          <img
            src={`/assets/Logo/${product.image}`}
            alt={product.name}
            onError={(e) => { e.target.src = "/assets/default.jpg"; }}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h3>{product.name}</h3>
          <div className="mb-3">
            <span className="text-primary fs-4 fw-bold">{product.price.toLocaleString()}đ</span>
          </div>

          <ul className="list-unstyled mb-3">
            <li><i className="fa fa-truck me-2"></i>Miễn phí vận chuyển từ 499.000đ</li>
            <li><i className="fa fa-sync-alt me-2"></i>Miễn phí đổi trả trong 30 ngày</li>
          </ul>

          {/* Số lượng */}
          <div className="d-flex align-items-start mb-3 gap-3">
            <label className="me-2 mt-2">Số lượng:</label>
              <div>
                <div className="input-group" style={{ width: "150px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, (parseInt(prev) || 1) - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    min="1"
                    onChange={handleQuantityInput}
                    onBlur={() => {
                      if (quantity === "" || quantity < 1) {
                        setQuantity(1);
                      }
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min((parseInt(prev) || 1) + 1, product.quantity))}
                  >
                    +
                  </button>
                </div>

                <p className="text-muted mb-0 mt-1">
                  Còn lại: <strong>{product.quantity}</strong> sản phẩm
                </p>
                {quantity > product.quantity && (
                  <p className="text-danger mt-1 mb-2" style={{ fontSize: "0.9rem" }}>
                    Vượt quá số lượng còn lại!
                  </p>
                )}
              </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-info" onClick={handleBuyNow}>Mua ngay</button>
            <button className="btn btn-outline-info" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
          </div>

          <div className="mt-4">
            <h5>Chi tiết sản phẩm</h5>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật */}
      {product.specifications?.length > 0 && (
        <div className="mt-5">
          <h5>Thông số kỹ thuật</h5>
          <ul>
            {product.specifications.map((spec, index) => (
              <li key={index}><strong>{spec.name}:</strong> {spec.value}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sản phẩm liên quan */}
      {relatedProducts?.length > 0 && (
        <div className="mt-5">
          <h5 className="pb-3">Sản phẩm liên quan</h5>
          <div className="row">
            {relatedProducts.map((related) => (
              <div key={related.id} className="col-md-2 col-sm-4 col-6 mb-4 px-2">
                <div className="card border-0 shadow-sm h-100">
                  <Link to={`/san-pham/${related.id}`}>
                    <img
                      src={`/assets/Logo/${related.image}`}
                      alt={related.name}
                      onError={(e) => { e.target.src = "/assets/default.jpg"; }}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  </Link>
                  <div className="card-body p-3">
                    <h6 className="card-title text-center">
                      <Link to={`/san-pham/${related.id}`} className="text-decoration-none text-dark">
                        {related.name}
                      </Link>
                    </h6>
                    <p className="text-primary fw-bold text-center mb-0">
                      {related.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
