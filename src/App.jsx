// src/App.jsx
import "animate.css";
import ChatBot from "./components/ChatBot";
import ProductCard from "./components/ProductCard";
import products from "./data/ProductData.json";

export default function App() {
  return (
    <div>
      <header className="bg-dark text-white py-3 shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">
            <img
              src="assets/icon.jpg"
              alt="logo mind the absurd"
              style={{
                height: "30px",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            />
            Mind The Absurd
          </h1>
          <span className="text-light">Toko Thrift</span>
        </div>
      </header>

      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-3">Selamat Datang di Mind The Absurd!</h2>
          <p className="lead">Personal Taste 🪄</p>
          <img
            src="https://www.monsoonlondon.com/on/demandware.static/-/Library-Sites-monsoon-content-global/default/dw79655ebe/landing/thrift/2023/feb/14022023_UK/1440-hero.jpg"
            alt="Hero Absurd Store"
            className="img-fluid rounded shadow mt-3"
          />
        </div>
      </section>
      <div className="container py-5">
        <h1 className="mb-4 text-center">Produk Absurd Store</h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {products.products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      <ChatBot />

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Absurd Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
