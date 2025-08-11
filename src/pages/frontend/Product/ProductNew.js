import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


const ProductNew = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Phần xử lý mua hàng
  const handleBuyNowClick = (product) => {
    const tempCart = [{
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }];
    localStorage.setItem("tempCart", JSON.stringify(tempCart));
    // Chuyển thẳng đến trang thanh toán
    navigate("/thanh-toan?buynow=true");
  };

  // Phần xử lý thêm giỏ hàng
  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = existingCart.findIndex((item) => item.id === product.id);

    if (itemIndex !== -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Đã thêm vào giỏ hàng!");
  };
    
  // Phần xử lý thêm yêu thích
  const handleAddToFavorites = (product) => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const alreadyExists = existingFavorites.some((item) => item.id === product.id);

    if (!alreadyExists) {
      existingFavorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      localStorage.setItem("favorites", JSON.stringify(existingFavorites));
      alert("Đã thêm vào danh sách yêu thích!");
    } else {
      alert("Sản phẩm đã có trong danh sách yêu thích.");
    }
  };

  // Phần xử lý lấy dữ liệu
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", token);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios.get("http://localhost:8081/api/products", { headers })
      .then(response => {
        response.data.reverse();
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError(`Error fetching products: ${err.message || err}`);
        setLoading(false);
      });
  }, []);

  // Phần xử lý kéo sản phẩm ngang
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 }},
      { breakpoint: 768, settings: { slidesToShow: 2 }},
      { breakpoint: 480, settings: { slidesToShow: 1 }},
    ]
  };

  // Phần hiển thị thông báo khi dữ liệu lỗi
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="product_new">
      <div className="container">
        <div className="mb-4">
          <h2 className="ms-1" style={{ color: "#00e1ffff" }}>_________</h2>
          <h3 style={{ color: "#000000ff" }}><b>HÀNG MỚI VỀ</b></h3>
        </div>

        <Slider {...settings}>
          {products.map(product => (
            <div key={product.id} className="px-2">
              <div className="card h-100 border-1 shadow-sm">
                <Link to={`/san-pham/${product.id}`}>
                  <img
                    src={`/assets/Logo/${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "/assets/default.jpg"; }}
                  />
                </Link>

                <div className="card-body d-flex flex-column p-2">
                  <h6 className="card-title text-center mb-2" style={{ minHeight: '2.5em' }}>
                    <Link
                      to={`/san-pham/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {product.name}
                    </Link>
                  </h6>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <p className="text-primary fw-bold mb-1 m-2">
                          {product.price.toLocaleString()}đ
                        </p>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleAddToCart(product)}
                        title="Thêm vào giỏ"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleAddToFavorites(product)}
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
        </Slider>

        <div className="text-center pt-4 pb-5">
          <Link to="/tat-ca-san-pham" className="btn btn-outline-info">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
      
    </section>
  );
};

export default ProductNew;    