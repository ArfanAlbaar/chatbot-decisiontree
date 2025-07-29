import "animate.css";
import { useEffect, useState } from "react";
import { getProducts } from "../api";
import ProductCard from "../components/ProductCard";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Flag untuk melacak apakah komponen masih ter-mount
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        // Hanya update state jika komponen masih ter-mount
        if (isMounted) {
          setProducts(response.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Gagal memuat produk. Silakan coba lagi nanti.");
        }
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Fungsi cleanup: akan dijalankan saat komponen di-unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* <header className="bg-dark text-white py-3 shadow">
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
      </header> */}

      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-3">Selamat Datang di Mind The Absurd!</h2>
          <p className="lead">Personal Taste 🪄</p>
          <img
            src="https://www.monsoonlondon.com/on/demandware.static/-/Library-Sites-monsoon-content-global/default/dw79655ebe/landing/thrift/2023/feb/14022023_UK/1440-hero.jpg"
            alt="Hero Absurd Store"
            className="img-fluid rounded shadow mt-3"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
      </section>
      <div className="container py-5">
        <h1 className="mb-4 text-center">Produk Absurd Store</h1>
        {loading && <div className="text-center">Memuat produk...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {!loading && !error && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
