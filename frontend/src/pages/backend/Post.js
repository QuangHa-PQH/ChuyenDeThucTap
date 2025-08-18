import React, { useState, useEffect } from 'react';
import axios from 'axios';
import slugify from 'slugify'; // Thêm thư viện slugify

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [trash] = useState([]);
  const [viewTrash, setViewTrash] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', slug: '' });

  // Lấy danh sách bài viết từ API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token"); // lấy token từ localStorage
      const response = await axios.get('http://localhost:8081/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`, // thêm token vào header Authorization
        },
      });

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if(name === 'description'){
      newValue = value.replace(/\\n/g, '\n');
    }
    setForm((prev) => {
      const newForm = { ...prev, [name]: newValue };
      if (name === 'title') {
        newForm.slug = slugify(value, { lower: true });
      }
      return newForm;
    });
  };

  const handleAdd = async () => {
    const newItem = { ...form };
    const token = localStorage.getItem("token");

    try {
      await axios.post('http://localhost:8081/api/posts', newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Thêm bài viết thành công!');
      fetchPosts(); // Tải lại danh sách bài viết sau khi thêm
      setForm({ title: '', description: '', slug: '' });
      setEditingPost(null);
    } catch (error) {
      console.error('Lỗi thêm bài viết:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({ title: post.title, description: post.description, slug: post.slug, image: post.image });
    window.scrollTo(0, 0); // Scroll lên đầu trang khi bấm sửa
  };

  const handleUpdate = async () => {
    const updated = { ...form };
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:8081/api/posts/${editingPost.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Sửa bài viết thành công!');
      fetchPosts(); // Tải lại danh sách bài viết sau khi cập nhật
      setForm({ title: '', description: '', slug: '' });
      setEditingPost(null);
    } catch (error) {
      console.error('Lỗi cập nhật bài viết:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8081/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Xóa bài viết thành công!');
      fetchPosts(); // Tải lại danh mục sau khi xóa
    } catch (error) {
      console.error('Lỗi xóa bài viết:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setForm({ title: '', description: '', slug: '' });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác bài viết' : 'Danh sách bài viết'}</h4>
        <div>
          {!viewTrash && !editingPost && (
            <button className="btn btn-primary me-2" onClick={() => setEditingPost({})}>
              Thêm bài viết
            </button>
          )}
          {viewTrash && (
            <button className="btn btn-secondary" onClick={() => setViewTrash(false)}>
              Quay lại
            </button>
          )}
        </div>
      </div>

      {!viewTrash && editingPost !== null && (
        <div className="card p-4 mb-3">
          <h5>{editingPost.id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h5>
          <form>
            <input
              className="form-control mb-2"
              placeholder="Tiêu đề bài viết"
              name="title"
              value={form.title}
              onChange={handleInputChange}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Nội dung bài viết"
              name="description"
              value={form.description}
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
              className="form-control mb-2"
              placeholder="Slug"
              name="slug"
              value={form.slug}
              readOnly
            />
            {editingPost.id ? (
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
            <th>Tiêu đề</th>
            <th>Hình</th>
            <th>Nội dung</th>            
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {(viewTrash ? trash : posts).map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td><img src={`/assets/Logo/${p.image}`} alt={p.name} style={{ width: '50px' }} /></td>
<td>
  {p.description.replace(/\\n/g, '\n').split('\n').map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      <br />
    </React.Fragment>
  ))}
</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(p)}>
                  Sửa
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {(viewTrash ? trash : posts).length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Không có bài viết</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Post;
