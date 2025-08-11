// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay cho useHistory

// const PostDetail = () => {
//   const { id } = useParams(); // Lấy id từ URL
//   const navigate = useNavigate(); // Sử dụng useNavigate thay cho useHistory
//   const [post, setPost] = useState(null);
//   const [form, setForm] = useState({ title: '', content: '', slug: '' });

//   // Lấy chi tiết bài viết
//   useEffect(() => {
//     fetchPostDetail();
//   }, [id]);

//   const fetchPostDetail = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Lấy token từ localStorage
//       const response = await axios.get(`http://localhost:8081/api/post-details/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
//         },
//       });
//       setPost(response.data);
//       setForm({ title: response.data.title, content: response.data.content, slug: response.data.slug });
//     } catch (error) {
//       console.error('Lỗi khi lấy chi tiết bài viết:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     const updatedPost = { ...form };
//     const token = localStorage.getItem('token');

//     try {
//       await axios.put(`http://localhost:8081/api/post-details/${id}`, updatedPost, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Cập nhật bài viết thành công!');
//       navigate('/posts'); // Điều hướng về danh sách bài viết sau khi cập nhật
//     } catch (error) {
//       console.error('Lỗi cập nhật bài viết:', error);
//     }
//   };

//   const handleDelete = async () => {
//     const token = localStorage.getItem('token');

//     try {
//       await axios.delete(`http://localhost:8081/api/post-details/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Bài viết đã bị xóa!');
//       navigate('/posts'); // Điều hướng về danh sách bài viết sau khi xóa
//     } catch (error) {
//       console.error('Lỗi xóa bài viết:', error);
//     }
//   };

//   if (!post) {
//     return <div>Đang tải bài viết...</div>;
//   }

//   return (
//     <div className="container my-4">
//       <h3>Chi tiết bài viết</h3>

//       <div className="card p-4 mb-3">
//         <h5>Sửa bài viết</h5>
//         <form>
//           <div className="mb-3">
//             <label className="form-label">Tiêu đề</label>
//             <input
//               type="text"
//               className="form-control"
//               name="title"
//               value={form.title}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Nội dung</label>
//             <textarea
//               className="form-control"
//               name="content"
//               value={form.content}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Slug</label>
//             <input
//               type="text"
//               className="form-control"
//               name="slug"
//               value={form.slug}
//               readOnly
//             />
//           </div>

//           <button type="button" className="btn btn-success me-2" onClick={handleUpdate}>
//             Cập nhật
//           </button>
//           <button type="button" className="btn btn-danger" onClick={handleDelete}>
//             Xóa
//           </button>
//         </form>
//       </div>

//       <h4>Thông tin bài viết</h4>
//       <div>
//         <p><strong>Tiêu đề:</strong> {post.title}</p>
//         <p><strong>Slug:</strong> {post.slug}</p>
//         <p><strong>Nội dung:</strong> {post.content}</p>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;
