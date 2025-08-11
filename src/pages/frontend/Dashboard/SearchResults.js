import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const keyword = query.get("keyword");
  const [results, setResults] = useState([]);

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
        quantity: 1
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
        image: product.image
      });
      localStorage.setItem("favorites", JSON.stringify(existingFavorites));
      alert("Đã thêm vào danh sách yêu thích!");
    } else {
      alert("Sản phẩm đã có trong danh sách yêu thích.");
    }
  };

  // Phần xử lý lấy dữ liệu
  useEffect(() => {
    if (keyword) {
      axios.get(`http://localhost:8081/api/products/search?keyword=${keyword}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }
  }, [keyword]);

  return (
    <div className="container mt-4">
      <h4 className="p-3">Kết quả tìm kiếm cho: <b>{keyword}</b></h4>
      <div className="row">
        {results.map((product) => (
          <div key={product.id} className="col-md-3 pb-5">
            <div className="card border-1 shadow-sm" >
              <Link to={`/san-pham/${product.id}`}>
                <img
                  src={`/assets/Logo/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '100%', objectFit: 'cover' }}
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
                      <p className="text-primary fw-bold mb-1" style={{marginLeft: "10px"}}>
                        {product.price.toLocaleString()}đ
                      </p>
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
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default SearchResults;
