import Category from "../pages/backend/Category";
import Product from "../pages/backend/Product";
import User from "../pages/backend/User";
import Brand from "../pages/backend/Brand";
import Order from "../pages/backend/Order";
import Home from "../pages/backend/Home";
import Login from "../pages/backend/Login"
import Index from "../components/backend/index"
import PrivateRoute from "../pages/backend/PrivateRoute";
import Post from "../pages/backend/Post";
import Contact from "../pages/backend/Contact";
import Dashboard from "../pages/backend/Dashboard";
const AdminRouter = [
  {
    path: "/admin/login",  // Định nghĩa trang login cho admin
    element: <Login />,    // Gắn component Login vào
  },

  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Index />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "product", element: <Product /> },
      { path: "category", element: <Category /> },
      { path: "user", element: <User /> },
      { path: "brand", element: <Brand /> },
      { path: "order", element: <Order /> },
      { path: "post", element: <Post /> },
      { path: "contact", element: <Contact /> },
      { path: "dashboard", element: <Dashboard /> },


      // { path: "postdetail", element: <PostDetail /> },
    ]
  }
];
export default AdminRouter;