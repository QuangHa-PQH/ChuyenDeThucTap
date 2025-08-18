import React, { useState, useEffect } from 'react';
import axios from 'axios';
import slugify from 'slugify';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [trash] = useState([]);
  const [viewTrash, setViewTrash] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', slug: '' });
  const [imageFile, setImageFile] = useState(null); // lưu file ảnh chọn
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/brands', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        console.error('Dữ liệu trả về không phải là mảng:', response.data);
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

  // ====== Thêm thương hiệu ======
  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("slug", form.slug);

      if (imageFile) {
        formData.append("image", imageFile); // key phải trùng backend
      }

      await axios.post('http://localhost:8081/api/brands', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert('Thêm thương hiệu thành công!');
      fetchBrands();
      setEditingBrand(null);
      setForm({ name: '', description: '', slug: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Lỗi thêm thương hiệu:', error);
    }
  };

  // ====== Sửa thương hiệu ======
  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setForm({ name: brand.name, description: brand.description, slug: brand.slug });
    setImageFile(null); // reset khi sửa
    window.scrollTo(0, 0);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("slug", form.slug);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`http://localhost:8081/api/brands/${editingBrand.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert('Sửa thương hiệu thành công!');
      fetchBrands();
      setEditingBrand(null);
      setForm({ name: '', description: '', slug: '' });
      setImageFile(null);
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
      fetchBrands();
    } catch (error) {
      console.error('Lỗi xóa thương hiệu:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setForm({ name: '', description: '', slug: '' });
    setImageFile(null);
  };

  const getPaginatedData = () => {
    const data = viewTrash ? trash : brands;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil((viewTrash ? trash.length : brands.length) / itemsPerPage);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác thương hiệu' : 'Danh sách thương hiệu'}</h4>
        <div>
          {!viewTrash && !editingBrand && (
            <button className="btn btn-primary me-2" onClick={() => setEditingBrand({})}>
              Thêm thương hiệu
            </button>
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
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
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
          {getPaginatedData().map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td>
                <img src={b.image} alt={b.name} style={{ width: '50px' }} />
              </td>
              <td>{b.slug}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(b)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {getPaginatedData().length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">Không có thương hiệu</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔥 Thanh phân trang */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau</button>
            </li>
          </ul>
        </nav>
      )}      
    </div>
  );
};

export default Brand;
