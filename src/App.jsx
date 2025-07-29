// src/App.jsx
import "animate.css";
import { Link, Route, Routes } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import OrderPage from "./pages/OrderPage";
import ProductListPage from "./pages/ProductListPage";
import ReturnPage from "./pages/ReturnPage";

export default function App() {
  return (
    <div>
      <header className="bg-dark text-white py-3 shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">
            <Link
              to="/"
              className="d-flex align-items-center text-white text-decoration-none"
            >
              <img
                src="/assets/icon.jpg"
                alt="logo mind the absurd"
                style={{
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
              Mind The Absurd
            </Link>
          </h1>
          <span className="text-light">Toko Thrift</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/order/:productId" element={<OrderPage />} />
        <Route path="/return" element={<ReturnPage />} />
      </Routes>

      <ChatBot />

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Absurd Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
