import { FaMapMarkerAlt, FaPhoneAlt  } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import axios from "axios";
import { useState } from "react";

const Introduce = () => {
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
                  <div className="col-md-12">
                        <div className="alena">
                            <h2 className="pt-4 pb-3"><b>Giới thiệu</b></h2>
                            
                            <p>HaShop thành lập năm 2015, thuộc quyền quản lý của Công ty TNHH HaShop. Với quy mô sản 
                               phẩm kinh doanh lớn, đa dạng và phong phú, Betashop có trên 3000 mặt hàng thuộc chủng loại 
                               điện tử, điện lạnh, gia dụng, kỹ thuật số, thiết bị tin học, thiết bị giải trí, viễn 
                               thông. ..</p>
                            <p>Với chiến lược tiết kiệm tối đa và tạo môi trường an tâm mua sắm, HaShop chú trọng xây 
                               dựng lợi ích thiết thực nhất cho khách hàng hiện nay. </p>
                               
                            <p><b>SẢN PHẨM TỐT - GIÁ TIẾT KIỆM</b></p>    
                            
                            <p>Được sự hỗ trợ từ các nhà sản xuất phân phối sản phẩm chuyên nghiệp hàng đầu tại Việt 
                               nam, các sản phẩm tại HaShop là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng, chế độ bảo 
                               hành bảo trì theo tiêu chuẩn của nhà sản xuất. </p>                     
                            <p>Giá cả của được bán theo tiêu chí “bán hàng tại kho”, do đó luôn thấp hơn so với thị 
                               trường, giúp người mua tiết kiệm được rất nhiều khoản kinh phí mua sắm. Đặc biệt, bên cạnh 
                               bán lẻ, HaShop có chế độ hỗ trợ giá tốt cho đơn vị có nhu cầu làm đại lý.</p>
                            <p>HaShop cũng là công ty có mức sản phẩm đầy đủ và đa dạng cao. Duy nhất tại đây, khách hàng 
                              có thể tìm thấy nhiều mã sản phẩm hiện không có ở nhiều siêu thị điện máy.</p>
                              
                            <p><b>TIẾT KIỆM THỜI GIAN VÀ CÔNG SỨC</b></p>
                            
                            <p>Để tiết kiệm thời gian và đảm bảo mọi cá nhân, đơn vị trên toàn quốc đều có thể mua sắm, 
                               HaShop lựa chọn hình thức kinh doanh chính là bán hàng online với những quy chế chặt chẽ 
                               về sự an toàn cũng như tiện lợi cho người mua:</p>
                            <p>+ Toàn bộ hình ảnh trên website đều được mô tả tỉ mỉ, chi tiết. Hình ảnh chụp thật 100%. 
                               Mọi thông tin đều rõ ràng, minh bạch. <br/>+ Sử dụng các phương thức thanh toán đa dạng, 
                               có độ tin cậy cao như: thanh toán tiền sau khi nhận hàng, chuyển khoản, bảo kim.<br/>+ 
                               Phương thức vận chuyển hàng nhanh chóng có bảo hiểm và dịch vụ lắp đặt tận nơi cho khách 
                               hàng.<br/>+ Cam kết bảo vệ thông tin riêng tư của khách hàng khi mua hàng online.</p>
                            <p>Ngoài ra, khi có nhu cầu tham khảo trực tiếp sản phẩm, khách hàng cũng có thể đến tại kho và văn phòng giao dịch tại Hà Nội.</p>
                           
                            <p><b>TIẾT KIỆM THỜI GIAN VÀ CÔNG SỨC</b></p>
                            
                            <p>Khi mua sắm tại Betashop, khách hàng sẽ được nhân viên tư vấn chuyên sâu, định hướng lựa 
                               chọn sản phẩm phù hợp nhất với nhu cầu sử dụng và tài chính. Mục tiêu cuối cùng là mang 
                               lại những thông tin thực sự khách quan, chính xác nhất và sự thoải mái và hài lòng cho 
                               khách hàng khi lựa chọn mua hàng. Betashop cũng đặc biệt dành nhiều chính sách ưu đãi 
                               chăm sóc cho khách hàng thân thiết, gắn bó.</p>
                            <p>Thành lập trên quan điểm kinh doanh nghiêm túc, chuyên nghiệp, Betashop luôn nhất quán 
                               trên hướng đi mang tới cho khách hàng cảm nhận khác biệt về sự phục vụ tận tình - tiện 
                               lợi tối đa, lấy chữ tâm làm đầu và mục đích gắn kết khách hàng bền lâu.</p>
                        </div>
                  </div>
              </div>
          </div>
      </div>
      
  );
};

export default Introduce;