import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrder, getProductById } from "../api";

export default function OrderPage() {
  const { productId } = useParams(); // Mengambil ID produk dari URL
  const navigate = useNavigate();

  // State untuk data produk dari API
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form input
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("L"); // Ukuran default
  const [color, setColor] = useState("Hitam"); // Warna default
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("Reguler");
  const [paymentProof, setPaymentProof] = useState(null);
  const [notes, setNotes] = useState("");
  const [shippingCost, setShippingCost] = useState(20000); // Default ongkir untuk Reguler

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Efek untuk menyesuaikan ongkos kirim berdasarkan metode pengiriman
  useEffect(() => {
    if (shippingMethod === "Reguler") {
      setShippingCost(20000);
    } else if (shippingMethod === "Sameday") {
      setShippingCost(35000);
    }
    // Bisa ditambahkan metode lain di sini jika perlu
  }, [shippingMethod]);

  // Efek untuk mengambil data produk saat komponen dimuat
  useEffect(() => {
    // Menggunakan AbortController untuk cleanup, ini adalah praktik modern
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(productId, { signal });
        setProduct(response.data.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Produk tidak ditemukan atau terjadi kesalahan.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Fungsi cleanup untuk membatalkan request jika komponen unmount
    return () => {
      controller.abort();
    };
  }, [productId]);

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Membuat objek FormData untuk mengirim file dan data teks
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("product_name", product.name);
    formData.append("quantity", quantity);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("customer_name", customerName);
    formData.append("phone_number", phoneNumber);
    formData.append("address", address);
    formData.append("shipping_method", shippingMethod);
    formData.append("shipping_cost", shippingCost);
    formData.append("notes", notes);

    // Tambahkan file hanya jika ada
    if (paymentProof) {
      formData.append("payment_proof", paymentProof);
    }

    try {
      const response = await createOrder(formData);
      console.log("Order created:", response.data);
      alert("Pesanan Anda berhasil dibuat!");
      // Redirect ke halaman sukses atau halaman utama setelah berhasil
      navigate("/");
    } catch (err) {
      console.error("Failed to create order:", err.response?.data);
      setSubmitError("Gagal mengirim pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="container my-5 text-center">Loading...</div>;
  if (error)
    return <div className="container my-5 alert alert-danger">{error}</div>;
  if (!product) return null;

  // Membuat kalkulasi lebih tangguh (robust) terhadap data dari API.
  // Ini memastikan kita selalu bekerja dengan angka dan menghindari NaN (Not a Number).
  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const finalPrice = price * (1 - discount / 100);
  const subtotal = finalPrice * quantity;
  const total = subtotal + shippingCost;

  return (
    <div className="container my-5">
      <h2>Form Pemesanan</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        {submitError && (
          <div className="alert alert-danger mb-3">{submitError}</div>
        )}
        <div className="row g-5">
          {/* Kolom Kiri: Detail Produk dan Form */}
          <div className="col-md-7">
            <h4>Detail Produk</h4>
            <div className="d-flex align-items-center p-3 border rounded mb-4">
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                className="me-3"
              />
              <div>
                <h5>{product.name}</h5>
                <p className="mb-0 fs-5 fw-bold text-primary">
                  Rp {finalPrice.toLocaleString("id-ID")}
                </p>
                {product.discount && (
                  <p className="mb-0 text-muted small">
                    <s className="me-2">
                      Rp {product.price.toLocaleString("id-ID")}
                    </s>
                    <span className="badge bg-danger">
                      -{product.discount}%
                    </span>
                  </p>
                )}
              </div>
            </div>

            <h4>Detail Pesanan</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label htmlFor="quantity" className="form-label">
                  Jumlah
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={product.stock > 0 ? quantity : 0}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10) || 1;
                    // Memastikan kuantitas tidak melebihi stok dan tidak kurang dari 1
                    const clampedQuantity = Math.max(
                      1,
                      Math.min(newQuantity, product.stock)
                    );
                    setQuantity(clampedQuantity);
                  }}
                  min="1"
                  max={product.stock}
                  disabled={product.stock === 0}
                />
                <div className="form-text text-muted">
                  Stok tersedia: {product.stock}
                </div>
              </div>
              <div className="col-md-4">
                <label htmlFor="size" className="form-label">
                  Ukuran
                </label>
                <select
                  className="form-select"
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="color" className="form-label">
                  Warna
                </label>
                <select
                  className="form-select"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="Hitam">Hitam</option>
                  <option value="Putih">Putih</option>
                  <option value="Biru Dongker">Biru Dongker</option>
                </select>
              </div>
            </div>

            <h4>Informasi Pemesan</h4>
            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">
                Nama Pemesan
              </label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                No. Telepon (WhatsApp)
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Alamat Detail Pengiriman
              </label>
              <textarea
                className="form-control"
                id="address"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan dan Pembayaran */}
          <div className="col-md-5">
            <div className="card sticky-top" style={{ top: "2rem" }}>
              <div className="card-header">
                <h4 className="mb-0">Ringkasan Pesanan</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Ongkos Kirim</span>
                    <strong>Rp {shippingCost.toLocaleString("id-ID")}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fs-5">
                    <span>Total Akhir</span>
                    <strong className="text-primary">
                      Rp {total.toLocaleString("id-ID")}
                    </strong>
                  </li>
                </ul>
                <div className="mt-4">
                  <label htmlFor="shippingMethod" className="form-label">
                    Pengiriman
                  </label>
                  <select
                    className="form-select mb-3"
                    id="shippingMethod"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    <option value="Reguler">Reguler (JNE/J&T)</option>
                    <option value="Sameday">Sameday (GoSend/Grab)</option>
                  </select>

                  <label htmlFor="paymentProof" className="form-label">
                    <strong>
                      BCA: 7151644094 / BRI: 480401066813534
                      <br />
                      a/n MUHAMMAD SALEH AFIF
                    </strong>
                    <br />
                    Upload Bukti Pembayaran
                  </label>
                  <input
                    type="file"
                    className="form-control mb-3"
                    id="paymentProof"
                    onChange={handleFileChange}
                    required
                  />

                  <label htmlFor="notes" className="form-label">
                    Catatan
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="card-footer p-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2"
                  disabled={product.stock === 0 || isSubmitting}
                >
                  {isSubmitting
                    ? "Mengirim..."
                    : product.stock === 0
                    ? "Stok Habis"
                    : "Kirim Pesanan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
