import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Phần xử lý lấy dữ liệu
  useEffect(() => {
    const fetchProductsByCategorySlug = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/categories/slug/${slug}`);
        if (response.data && response.data.products) {
          setName(response.data.name);
          setProducts(response.data.products);
        } else {
          setName('');
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      }
    };
    fetchProductsByCategorySlug();
  }, [slug]);

  // Phần xử lý mua hàng
  const handleBuyNowClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  // Phần xử lý thêm giỏ hàng
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  // Phần xử lý thêm yêu thích
  const handleAddToFavorites = (product) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(item => item.id === product.id)) {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Đã thêm vào danh sách yêu thích!");
    } else {
      alert("Sản phẩm đã có trong danh sách yêu thích.");
    }
  };

  return (
    <section>
      <div className="container my-4">
        <h1 className="mb-4">{name}</h1>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3 col-sm-6 col-12 mb-4 px-2" key={product.id}>
              <div className="card border-1 shadow-sm h-100">
                <a href={`/san-pham/${product.id}`}>
                  <img
                    src={`/assets/Logo/${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "100%", objectFit: "cover" }}
                  />
                </a>
                <div className="card-body p-3">
                  <h6 className="card-title text-center">
                    <a href={`/san-pham/${product.id}`} className="text-decoration-none text-dark">
                      {product.name}
                    </a>
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-primary fw-bold mb-0">
                        {product.price?.toLocaleString()}đ
                      </p>
                      {product.oldPrice && (
                        <p className="text-muted text-decoration-line-through mb-0">
                          {product.oldPrice.toLocaleString()}đ
                        </p>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
                            return;
                          }
                          handleAddToCart(product);
                        }}
                        title="Thêm vào giỏ"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            alert("Bạn cần đăng nhập để thêm vào danh sách yêu thích.");
                            return;
                          }
                          handleAddToFavorites(product);
                        }}
                        title="Yêu thích"
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>

                  </div>

                  <div className="text-center p-2">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleBuyNowClick(product)}
                      >
                        Mua ngay
                      </button>
                    </div>

                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center">Không có sản phẩm trong danh mục này.</div>
          )}
        </div>
        
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn số lượng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedProduct && (
          <div className="text-center">
            <img
              src={`/assets/Logo/${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="mb-3"
              style={{ width: "120px", objectFit: "cover" }}
            />

            <h5>{selectedProduct.name}</h5>
            <p className="text-danger fw-bold">
              {selectedProduct.price.toLocaleString()}đ
            </p>
            
            <p className="text-muted mb-0">
              Còn lại: <strong>{selectedProduct.quantity}</strong> sản phẩm
            </p>
            {quantity > selectedProduct.quantity && (
              <p className="text-danger mb-2">Vượt quá số lượng còn lại!</p>
            )}

            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                onChange={(e) => {
                  const inputValue = parseInt(e.target.value);
                  if (isNaN(inputValue)) {
                    setQuantity("");
                  } else if (inputValue < 1) {
                    setQuantity(1);
                  } else {
                    setQuantity(inputValue);
                  }
                }}
                onBlur={() => {
                  if (quantity === "" || quantity < 1) {
                    setQuantity(1);
                  }
                }}
                style={{ width: "100px" }}
              />

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(selectedProduct.quantity, prev + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>
        )}
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={() => {
              const tempCart = [
                {
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,
                  image: selectedProduct.image,
                  quantity: quantity,
                },
              ];
              localStorage.setItem("tempCart", JSON.stringify(tempCart));
              setShowModal(false);
              navigate("/thanh-toan?buynow=true");
            }}
          >
            Thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
      
    </section>
  );
};

export default CategoryProducts;
