import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [trash] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [viewTrash] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
  const [imageFile, setImageFile] = useState(null);

  
  // Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi lấy categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/brands", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data);
    } catch (error) {
      console.error("Lỗi lấy brands:", error);
    }
  };

  const generateSlug = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const slug = generateSlug(form.name);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("quantity", form.quantity);
      formData.append("categoryId", form.categoryId);
      formData.append("brandId", form.brandId);
      formData.append("slug", slug);

      if (imageFile) {
        formData.append("image", imageFile); // Tên "image" phải trùng backend
      }

      await axios.post('http://localhost:8081/api/products', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert('Thêm sản phẩm thành công!');
      fetchProducts();
      setForm({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
      setImageFile(null);
      setEditingProduct(null);
    } catch (error) {
      console.error('Lỗi thêm sản phẩm:', error);
    }
  };


  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm(product);
    window.scrollTo(0, 0);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("quantity", form.quantity);
      formData.append("categoryId", form.categoryId);
      formData.append("brandId", form.brandId);
      formData.append("slug", generateSlug(form.name));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`http://localhost:8081/api/products/${editingProduct.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert('Cập nhật sản phẩm thành công!');
      fetchProducts();
      setForm({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
      setImageFile(null);
      setEditingProduct(null);
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
    }
  };


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8081/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
  };

  // Tính dữ liệu phân trang
  const displayedProducts = (viewTrash ? trash : products).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((viewTrash ? trash : products).length / itemsPerPage);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác sản phẩm' : 'Danh sách sản phẩm'}</h4>
        <div>
          {!viewTrash && !editingProduct && (
            <button className="btn btn-primary me-2" onClick={() => setEditingProduct({})}>
              Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      {!viewTrash && editingProduct !== null && (
        <div className="card p-4 mb-3">
          <h5>{editingProduct.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
          <form>
            <input 
              className="form-control mb-2" 
              placeholder="Tên sản phẩm" 
              name="name" 
              value={form.name} 
              onChange={handleInputChange} 
            />

            {/* Giá: chỉ nhập số */}
            <input 
              className="form-control mb-2" 
              type="number" 
              placeholder="Giá" 
              name="price" 
              value={form.price} 
              onChange={handleInputChange} 
              min="0"
            />

            {/* Mô tả: textarea thay cho input */}
            <textarea
              className="form-control mb-2"
              placeholder="Mô tả"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows="4"
            />

            <input 
              className="form-control mb-2" 
              type="file" 
              onChange={(e) => setImageFile(e.target.files[0])} 
            />

            {/* Số lượng: chỉ nhập số */}
            <input 
              className="form-control mb-3" 
              type="number"
              placeholder="Số lượng" 
              name="quantity" 
              value={form.quantity} 
              onChange={handleInputChange} 
              min="0"
            />

            <select 
              className="form-control mb-3" 
              name="categoryId" 
              value={form.categoryId} 
              onChange={handleInputChange}
            >
              <option value="">-- Chọn Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
              ))}
            </select>

            <select 
              className="form-control mb-3" 
              name="brandId" 
              value={form.brandId} 
              onChange={handleInputChange}
            >
              <option value="">-- Chọn Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.id} - {b.name}</option>
              ))}
            </select>

            {editingProduct.id ? (
              <button type="button" className="btn btn-success me-2" onClick={handleUpdate}>Cập nhật</button>
            ) : (
              <button type="button" className="btn btn-success me-2" onClick={handleAdd}>Thêm</button>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Hủy</button>
          </form>
        </div>
      )}

      {/* Bảng sản phẩm */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category ID</th>
            <th>Brand ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Hình</th>
            <th>Mô tả</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.categoryId}</td>
              <td>{p.brandId}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td><img src={p.image} alt={p.name} style={{ width: '50px' }} /></td>
              <td>{p.description}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(p)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {displayedProducts.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">Không có sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Nút phân trang */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>Trước</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>Sau</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Product;
