import { FaMapMarkerAlt, FaPhoneAlt  } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import axios from "axios";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/contacts", form);
      alert("Gửi thông tin thành công!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Gửi thất bại!");
    }
  };

  return (

      <div className="contact">
          <div className="container py-3">
              <div className="row">
                  <div className="col-md-6">
                        <div className="alena">
                            <h5>Công ty TNHH thời trang Alena</h5>
                            <p className="map"><FaMapMarkerAlt /><b className="ms-2">Địa chỉ:</b> Tầng 6, Tòa nhà Ladeco, 266 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, TP Hà Nội</p>
                            <p className="time"><MdEmail /><b className="ms-2">Email:</b> support@sapo.vn</p>
                            <p className="tel"><FaPhoneAlt /><b className="ms-2">Hotline:</b> 1900 6750</p>                         
                        </div>
                        <div className="form-alena" style={{ maxWidth: "450px" }}>
                            <h5 className="pb-2">Liên hệ với chúng tôi</h5>
                            <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input type="text" name="name" className="form-control" placeholder="Họ và tên" required value={form.name} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <input type="email" name="email" className="form-control" placeholder="Email" required value={form.email} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <input type="text" name="phone" className="form-control" placeholder="Số điện thoại" required value={form.phone} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <textarea name="message" placeholder="Nội dung" className="form-control" rows="4" required value={form.message} onChange={handleChange}></textarea>
                            </div>
                            <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#00bfffff" }}>
                                Gửi thông tin
                            </button>
                            </form>
                        </div>
                  </div>
                  <div className="col-md-6">
                  </div>
              </div>
          </div>
      </div>
      
  );
};

export default Contact;