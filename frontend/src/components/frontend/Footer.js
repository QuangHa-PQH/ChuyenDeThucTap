import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt  } from "react-icons/fa";
import { IoTime } from "react-icons/io5";


const Footer = () => {
    return (
        <div className="project">
            <section className="footer pt-4" style={{backgroundColor: "#000000"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
                            Ha<span style={{color: "#00b7ffff"}}>Shop</span>
                            </Link>

                            <p className="text" style={{ color: "#00a4fcff" }}>Shop thương mại điện tử</p>
                            <div className="item" style={{color: "#CCCCCC"}}>
                                <p className="map"><FaMapMarkerAlt /> Tầng 6, Tòa nhà Ladeco, 266 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, TP Hà Nội</p>
                                <p className="time"><IoTime /> Giờ làm việc: Từ 9:00 đến 22:00 các ngày trong tuần từ Thứ 2 đến Chủ nhật</p>
                                <p className="tel"><FaPhoneAlt /> Hotline: 1900 6750</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <h5 style={{color: "#FFFFFF"}}>Về chúng tôi</h5>
                            <div className="list-menu" style={{color: "#CCCCCC"}}>
                                <p>Trang chủ</p>
                                <p>Thời trang nam</p>
                                <p>Sản phẩm</p>
                                <p>Bé trai</p>
                                <p>Bé gái</p>
                                <p>Tin tức</p>
                                <p>Liên hệ</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h5 style={{color: "#FFFFFF"}}>Hỗ trợ khách hàng</h5>
                            <div className="list-menu" style={{color: "#CCCCCC"}}>
                                <p>Trang chủ</p>
                                <p>Thời trang nam</p>
                                <p>Sản phẩm</p>
                                <p>Bé trai</p>
                                <p>Bé gái</p>
                                <p>Tin tức</p>
                                <p>Liên hệ</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <h5 style={{color: "#FFFFFF"}}>Dịch vụ</h5>
                            <div className="list-menu" style={{color: "#CCCCCC"}}>
                                <p>Trang chủ</p>
                                <p>Thời trang nam</p>
                                <p>Sản phẩm</p>
                                <p>Bé trai</p>
                                <p>Bé gái</p>
                                <p>Tin tức</p>
                                <p>Liên hệ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default Footer;