import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/ProductCard.css";

export default function ProductCard({
  id,
  image,
  name,
  price,
  discount,
  rating,
  stock,
  description = "",
}) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            setIsVisible(true);
          } else if (entry.intersectionRatio < 0.2) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5, 1],
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  function getShortDescription(desc) {
    if (!desc) return "";
    const words = desc.split(" ");
    if (words.length >= 50) return desc;
    return words.slice(0, 20).join(" ") + " ...";
  }

  return (
    <>
      <div
        className={`card product-card h-100 position-relative ${
          isVisible ? "animate-in" : "animate-out"
        }`}
        ref={cardRef}
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      >
        {discount && (
          <div className="discount-badge position-absolute top-0 start-0 m-2 px-3 py-2 shadow-sm">
            <span className="fw-bold">-{discount}%</span>{" "}
          </div>
        )}
        {stock === 0 && (
          <div className="soldout-badge position-absolute top-0 end-0 m-2 px-3 py-2 shadow-sm">
            <span className="fw-bold">STOK HABIS</span>
          </div>
        )}
        <div className="product-image-container overflow-hidden position-relative">
          <img src={image} className="card-img-top product-image" alt={name} />
        </div>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title product-name mb-2">{name}</h5>
            <div className="mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`bi bi-star${
                    i < Math.floor(rating) ? "-fill" : ""
                  }${rating - i > 0 && rating - i < 1 ? "-half" : ""}`}
                  style={{
                    color: i < rating ? "#ffc107" : "#e4e5e9",
                    fontSize: "1.1rem",
                  }}
                />
              ))}
              <span className="text-muted ms-2 small">{rating.toFixed(1)}</span>
            </div>
            <p className="text-muted small mb-2" style={{ minHeight: 48 }}>
              {getShortDescription(description)}
            </p>
          </div>
          <div>
            <div className="mb-3">
              <p className="mb-0 fw-bold fs-5 text-primary">
                Rp {discountedPrice.toLocaleString("id-ID")}
              </p>
              {discount && (
                <p className="mb-0 text-muted small">
                  <s>Rp {price.toLocaleString("id-ID")}</s>
                </p>
              )}
            </div>
            <Link
              to={stock === 0 ? "#" : `/order/${id}`}
              className={`btn ${
                stock === 0 ? "btn-secondary disabled" : "buy-button"
              } mt-2 w-100 fw-bold py-2 text-decoration-none`}
              role="button"
              aria-disabled={stock === 0}
              onClick={(e) => e.stopPropagation()}
            >
              {stock === 0 ? (
                "Stok Habis"
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>Pesan Sekarang
                </>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={image}
                  alt={name}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: 250, objectFit: "cover" }}
                />
                <p className="mb-2">
                  <strong>Harga: </strong>
                  Rp{" "}
                  {discount
                    ? (price * (1 - discount / 100)).toLocaleString("id-ID")
                    : price.toLocaleString("id-ID")}
                  {discount && (
                    <span className="text-muted ms-2">
                      <s>Rp {price.toLocaleString("id-ID")}</s>
                    </span>
                  )}
                </p>
                <p>
                  <strong>Deskripsi:</strong>
                  <br />
                  {description}
                </p>
              </div>
              <div className="modal-footer d-flex gap-2 justify-content-end">
                {stock > 0 && (
                  <Link
                    to={`/order/${id}`}
                    className="btn btn-primary fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                    style={{ minWidth: 140, minHeight: 40, lineHeight: "24px" }}
                  >
                    <i className="bi bi-cart-plus"></i>
                    <span>Pesan Sekarang</span>
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                  onClick={() => setShowModal(false)}
                  style={{ minWidth: 100, minHeight: 40, lineHeight: "24px" }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
