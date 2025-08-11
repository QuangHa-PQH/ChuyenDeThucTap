import Home from "../pages/frontend/Home";
import Login from "../pages/frontend/Dashboard/Login";
import Logout from "../pages/frontend/Dashboard/Logout";
import Register from "../pages/frontend/Dashboard/Register";
import Contact from "../pages/frontend/Dashboard/Contact"
import Introduce from "../pages/frontend/Dashboard/Introduce"
import ProductDetail from "../pages/frontend/Product/ProductDetail"
import Cart from "../pages/frontend/Cart/Cart"
import Favorites from "../pages/frontend/Favorites/Favorites";
import Checkout from "../pages/frontend/Cart/Checkout";
import CategoryProduct from "../pages/frontend/Category/CategoryProducts"
import SearchResults from "../pages/frontend/Dashboard/SearchResults"
import PostList from "../pages/frontend/Post/PostList";
import PostDetail from "../pages/frontend/Post/PostDetail";

import Index from "../components/frontend/index"
import UserProfile from "../pages/frontend/Dashboard/UserProfile";
import ProductAll from "../pages/frontend/Product/ProductAll";
import VNPayReturn from "../pages/frontend/Cart/VnpayReturn";

const AdminRouter = [
  {
    path: "/",
    element: <Index />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart />},
      { path: "thanh-toan", element: <Checkout /> },
      { path: "vnpay-return", element: <VNPayReturn  />},
      { path: "customer", element: <UserProfile />},
      { path: "yeu-thich", element: <Favorites />},
      { path: "lien-he", element: <Contact /> },
      { path: "gioi-thieu", element: <Introduce /> },
      { path: "san-pham/:id", element: <ProductDetail /> },
      { path: "tat-ca-san-pham", element: <ProductAll /> },
      { path: "search", element: <SearchResults /> },
      { path: "tin-tuc", element: <PostList /> },
      { path: "tin-tuc/:id", element: <PostDetail /> },
      { path: ":slug", element: <CategoryProduct /> },      
      // ...
    ]
  }
];
export default AdminRouter;