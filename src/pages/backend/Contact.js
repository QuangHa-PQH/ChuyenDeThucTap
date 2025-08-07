import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách liên hệ từ API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách liên hệ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch (error) {
      console.error('Lỗi xóa liên hệ:', error);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Danh sách liên hệ</h4>
      </div>

      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Nội dung</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Không có liên hệ nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Contact;
