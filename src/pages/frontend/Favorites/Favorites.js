import React, { useState, useEffect } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleRemove = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  if (favorites.length === 0) {
    return (
      <div className="container py-5">
        <h2>Danh Sách Yêu Thích</h2>
        <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Danh Sách Yêu Thích</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Hình</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((item) => (
            <tr key={item.id}>
              <td style={{ width: "80px" }}>
                <img
                  src={`/assets/Logo/${item.image}`}
                  alt={item.name}
                  style={{ width: "60px" }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()}đ</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(item.id)}
                >
                  Xóa khỏi yêu thích
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Favorites;
