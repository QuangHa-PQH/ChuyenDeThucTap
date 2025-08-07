import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa token và role khỏi localStorage khi đăng xuất
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Chuyển hướng về trang đăng nhập
        navigate("/admin/login");
    };

    return (
        <section className="Header">
            <nav className="navbar navbar-expand-lg bg-black" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="">Admin</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/admin/dashboard">Thống kê</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sản phẩm
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/admin/product">Quản lý sản phẩm</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/category">Quản lý danh mục</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/brand">Quản lý thương hiệu</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/admin/post">Bài viết</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/admin/order">Đơn hàng</Link>
                            </li>      
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/admin/contact">Phản hồi</Link>
                            </li>                             
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/admin/user">Thành viên</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Nút Đăng xuất nằm bên phải */}
                    <button onClick={handleLogout} className="btn btn-outline-light ms-auto">
                        Đăng xuất
                    </button>
                </div>
            </nav>
        </section>
    );
};

export default Header;
