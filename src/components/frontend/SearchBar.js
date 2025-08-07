import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn form reload
    if (keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <form
      className="input-group"
      onSubmit={handleSearch}
      style={{ maxWidth: "350px", width: "100%" }}
    >
      <input
        type="text"
        className="form-control"
        placeholder="Tìm sản phẩm bạn mong muốn"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        className="btn"
        type="submit"
        style={{ backgroundColor: "#F7931E", color: "white" }}
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
