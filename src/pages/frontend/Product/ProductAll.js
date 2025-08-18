import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProductAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


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
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/api/products");
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tất cả sản phẩm", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Phần hiển thị thông báo khi dữ liệu lỗi
  if (loading) return <div className="text-center py-5">Đang tải sản phẩm...</div>;

  return (
    <section>
      <div>
        <div className="container py-4">
          <h1 className="mb-4"><b>Tất Cả Sản Phẩm</b></h1>
          <div className="row">
            {currentProducts.length === 0 ? (
              <p>Không có sản phẩm nào.</p>
            ) : (
              currentProducts.map((product) => (
                <div key={product.id} className="col-md-3 mb-4">
                  <div className="card h-100 border-1 shadow-sm">
                    <Link to={`/san-pham/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "/assets/default.jpg"; }}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column p-2">
                      <h6 className="card-title text-center mb-2" style={{ minHeight: "2.5em" }}>
                        <Link
                          to={`/san-pham/${product.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {product.name}
                        </Link>
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <p className="text-primary fw-bold mb-1" style={{ marginLeft: "10px" }}>
                            {product.price.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAddToCart(product)} title="Thêm vào giỏ">
                            <i className="fas fa-shopping-cart"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAddToFavorites(product)} title="Yêu thích">
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>

                      <div className="text-center">
                        <button className="btn btn-sm btn-outline-info" onClick={() => handleBuyNowClick(product)}>
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => paginate(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>      
    </section>

  );
};

export default ProductAll;
