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

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();

  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token"); // lấy token ra
      const response = await axios.get("http://localhost:8081/api/products", {
        headers: {
          Authorization: `Bearer ${token}`, // thêm header Authorization
        },
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
  const newItem = { ...form, slug };
  const token = localStorage.getItem("token"); // lấy token

  try {
    await axios.post('http://localhost:8081/api/products', newItem, {
      headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
    });
    alert('Thêm sản phẩm thành công!');
    fetchProducts(); // Tải lại danh sách sản phẩm sau khi thêm
    setForm({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
    setEditingProduct(null);
  } catch (error) {
    if (error.response) {
      // Lỗi từ server, in thêm thông tin chi tiết
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Lỗi không nhận được phản hồi
      console.error('Không nhận được phản hồi:', error.request);
    } else {
      // Lỗi khi thiết lập yêu cầu
      console.error('Lỗi thiết lập yêu cầu:', error.message);
    }
  }
};

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm(product);
    // Cuộn trang lên đầu khi bấm sửa
    window.scrollTo(0, 0);
  };

  const handleUpdate = async () => {
    const updated = { ...form, slug: generateSlug(form.name) };
    const token = localStorage.getItem("token"); // lấy token
    console.log("Token:", token); // Kiểm tra token
    
    try {
      await axios.put(`http://localhost:8081/api/products/${editingProduct.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
      });
      alert('Cập nhật sản phẩm thành công!');
      fetchProducts(); // Tải lại danh sách sản phẩm sau khi cập nhật
      setForm({ name: '', price: '', description: '', image: '', quantity: '', categoryId: '', brandId: '' });
      setEditingProduct(null);
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // lấy token

    try {
      await axios.delete(`http://localhost:8081/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
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

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác sản phẩm' : 'Danh sách sản phẩm'}</h4>
        <div>
          {!viewTrash && !editingProduct && (
            <>
              <button className="btn btn-primary me-2" onClick={() => setEditingProduct({})}>
                Thêm sản phẩm
              </button>
            </>
          )}

        </div>
      </div>

      {/* Form Thêm / Sửa */}
      {!viewTrash && editingProduct !== null && (
        <div className="card p-4 mb-3">
          <h5>{editingProduct.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
          <form>
            <input className="form-control mb-2" placeholder="Tên sản phẩm" name="name" value={form.name} onChange={handleInputChange} />
            <input className="form-control mb-2" placeholder="Giá" name="price" value={form.price} onChange={handleInputChange} />
            <input className="form-control mb-2" placeholder="Mô tả" name="description" value={form.description} onChange={handleInputChange} />
            
            <input className="form-control mb-2" placeholder="Link hình ảnh" name="image" value={form.image} onChange={handleInputChange} />
            
            <input className="form-control mb-3" placeholder="Số lượng" name="quantity" value={form.quantity} onChange={handleInputChange} />
            
            <select
              className="form-control mb-3"
              name="categoryId"
              value={form.categoryId}
              onChange={handleInputChange}
            >
              <option value="">-- Chọn Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
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
                <option key={b.id} value={b.id}>
                  {b.id} - {b.name}
                </option>
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

      {/* Bảng danh sách sản phẩm hoặc thùng rác */}
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
          {(viewTrash ? trash : products).map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.categoryId}</td>
              <td>{p.brandId}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td><img src={`/assets/Logo/${p.image}`} alt={p.name} style={{ width: '50px' }} /></td>
              <td>{p.description}</td>
              <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(p)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {(viewTrash ? trash : products).length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">Không có sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
