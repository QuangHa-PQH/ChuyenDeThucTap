import React, { useState, useEffect } from 'react';
import axios from 'axios';
import slugify from 'slugify';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [trash] = useState([]);
  const [viewTrash, setViewTrash] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', description: '', slug: '' });

  // Lấy danh sách thương hiệu từ API
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/brands', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        console.error('Dữ liệu trả về không phải là mảng, dữ liệu trả về là:', response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thương hiệu:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      if (name === 'name') {
        newForm.slug = slugify(value, { lower: true });
      }
      return newForm;
    });
  };

  const handleAdd = async () => {
    const newItem = { ...form };
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:8081/api/brands', newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Thêm thương hiệu thành công!');
      fetchBrands(); // Reload lại dữ liệu sau khi thêm
      setEditingBrand(null);
      setForm({ name: '', image: '', description: '', slug: '' });
    } catch (error) {
      console.error('Lỗi thêm thương hiệu:', error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setForm({ name: brand.name, image: brand.image, description: brand.description, slug: brand.slug });
    window.scrollTo(0, 0); // Scroll lên đầu trang khi bấm sửa
  };

  const handleUpdate = async () => {
    const updated = { ...form };
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:8081/api/brands/${editingBrand.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Sửa thương hiệu thành công!');
      fetchBrands(); // Reload lại dữ liệu sau khi cập nhật
      setEditingBrand(null);
      setForm({ name: '', image: '', description: '', slug: '' });
    } catch (error) {
      console.error('Lỗi cập nhật thương hiệu:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8081/api/brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Xóa thương hiệu thành công!');
      fetchBrands(); // Reload lại dữ liệu sau khi xóa
    } catch (error) {
      console.error('Lỗi xóa thương hiệu:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setForm({ name: '', image: '', description: '', slug: '' });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác thương hiệu' : 'Danh sách thương hiệu'}</h4>
        <div>
          {!viewTrash && !editingBrand && (
            <>
              <button className="btn btn-primary me-2" onClick={() => setEditingBrand({})}>
                Thêm thương hiệu
              </button>
            </>
          )}
          {viewTrash && (
            <button className="btn btn-secondary" onClick={() => setViewTrash(false)}>
              Quay lại
            </button>
          )}
        </div>
      </div>

      {!viewTrash && editingBrand !== null && (
        <div className="card p-4 mb-3">
          <h5>{editingBrand.id ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}</h5>
          <form>
            <input
              className="form-control mb-2"
              placeholder="Tên thương hiệu"
              name="name"
              value={form.name}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              placeholder="Link hình ảnh"
              name="image"
              value={form.image}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-3"
              placeholder="Slug"
              name="slug"
              value={form.slug}
              readOnly
            />
            {editingBrand.id ? (
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
            <th>Hình</th>
            <th>Slug</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {(viewTrash ? trash : brands).map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td><img src={`/assets/Logo/${b.image}`} alt={b.name} style={{ width: '50px' }} /></td>
              <td>{b.slug}</td>
              <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(b)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {(viewTrash ? trash : brands).length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">Không có thương hiệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Brand;
