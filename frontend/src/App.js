import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ScrollToTop from "./components/frontend/ScrollToTop";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRouter from "./router/AdminRouter";
import FrontendRouter from "./router/FrontendRouter";

function App() {
  const allRoutes = [...FrontendRouter, ...AdminRouter];

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {allRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children?.map((child, i) => (
              <Route key={i} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
