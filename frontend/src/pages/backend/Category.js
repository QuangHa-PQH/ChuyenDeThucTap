import React, { useState, useEffect } from 'react';
import axios from 'axios';
import slugify from 'slugify'; // Thêm thư viện slugify

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [trash] = useState([]);
  const [viewTrash, setViewTrash] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', slug: '' });

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token"); // lấy token từ localStorage
      const response = await axios.get('http://localhost:8081/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`, // thêm token vào header Authorization
        },
      });

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      // Tạo slug tự động từ tên khi thay đổi tên
      if (name === 'name') {
        newForm.slug = slugify(value, { lower: true });
      }
      return newForm;
    });
  };

  const handleAdd = async () => {
    const newItem = { ...form };
    const token = localStorage.getItem("token");

    try {
      await axios.post('http://localhost:8081/api/categories', newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Thêm danh mục thành công!');
      fetchCategories(); // Tải lại danh sách danh mục sau khi thêm
      setForm({ name: '', description: '', slug: '' });
      setEditingCategory(null);
    } catch (error) {
      console.error('Lỗi thêm danh mục:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name, description: category.description, slug: category.slug });
    window.scrollTo(0, 0); // Scroll lên đầu trang khi bấm sửa
  };

  const handleUpdate = async () => {
    const updated = { ...form };
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:8081/api/categories/${editingCategory.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Sửa danh mục thành công!');
      fetchCategories(); // Tải lại danh sách danh mục sau khi cập nhật
      setForm({ name: '', description: '', slug: '' });
      setEditingCategory(null);
    } catch (error) {
      console.error('Lỗi cập nhật danh mục:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8081/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Xóa danh mục thành công!');
      fetchCategories(); // Tải lại danh mục sau khi xóa
    } catch (error) {
      console.error('Lỗi xóa danh mục:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', slug: '' });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác danh mục' : 'Danh sách danh mục'}</h4>
        <div>
          {!viewTrash && !editingCategory && (
            <button className="btn btn-primary me-2" onClick={() => setEditingCategory({})}>
              Thêm danh mục
            </button>
          )}
          {viewTrash && (
            <button className="btn btn-secondary" onClick={() => setViewTrash(false)}>
              Quay lại
            </button>
          )}
        </div>
      </div>

      {!viewTrash && editingCategory !== null && (
        <div className="card p-4 mb-3">
          <h5>{editingCategory.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h5>
          <form>
            <input
              className="form-control mb-2"
              placeholder="Tên danh mục"
              name="name"
              value={form.name}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              placeholder="Slug"
              name="slug"
              value={form.slug}
              readOnly
            />
            {editingCategory.id ? (
              <button type="button" className="btn btn-success me-2" onClick={handleUpdate}>
                Cập nhật
              </button>
            ) : (
              <button type="button" className="btn btn-success me-2" onClick={handleAdd}>
                Thêm
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              Hủy
            </button>
          </form>
        </div>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Slug</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {(viewTrash ? trash : categories).map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(c)}>
                  Sửa
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {(viewTrash ? trash : categories).length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Không có danh mục</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
