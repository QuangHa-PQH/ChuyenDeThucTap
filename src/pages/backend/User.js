import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [trash] = useState([]);
  const [viewTrash] = useState(false);

  // Hàm lấy danh sách người dùng từ API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users', {
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Tải lại danh sách người dùng sau khi xóa
    } catch (error) {
      console.error('Lỗi xóa người dùng:', error);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{viewTrash ? 'Thùng rác người dùng' : 'Danh sách người dùng'}</h4>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Vai trò</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {(viewTrash ? trash : users).map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.password}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {(viewTrash ? trash : users).length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">Không có người dùng</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default User;
