// src/components/ProductCard.jsx
import { useEffect, useRef, useState } from "react";
import "../assets/ProductCard.css";

export default function ProductCard({
  image,
  name,
  price,
  discount,
  rating,
  stock,
  link,
}) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const discountedPrice = discount
    ? (price * (1 - discount / 100)).toFixed(2)
    : price;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger when more than 50% of the card is visible
          if (entry.intersectionRatio > 0.5) {
            setIsVisible(true);
          } else if (entry.intersectionRatio < 0.2) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5, 1], // Multiple thresholds for smoother transitions
        rootMargin: "0px 0px -50px 0px", // Small negative margin at bottom
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

  const whatsAppNumber = "6289601054387";
  const message = `Halo min, saya mau beli produk ini : ${link}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

  return (
    <div
      className={`card product-card h-100 position-relative ${
        isVisible ? "animate-in" : "animate-out"
      }`}
      ref={cardRef}
    >
      {discount && (
        <div className="discount-badge position-absolute top-0 start-0 m-2 px-3 py-2 shadow-sm">
          <span className="fw-bold">-{discount}%</span>{" "}
        </div>
      )}
      {/* Badge Stok Habis */}
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
                className={`bi bi-star${i < Math.floor(rating) ? "-fill" : ""}${
                  rating - i > 0 && rating - i < 1 ? "-half" : ""
                }`}
                style={{
                  color: i < rating ? "#ffc107" : "#e4e5e9",
                  fontSize: "1.1rem",
                }}
              />
            ))}
            <span className="text-muted ms-2 small">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <p className="mb-0 fw-bold fs-5 text-primary">
              Rp {discount ? discountedPrice : price.toLocaleString("id-ID")}
            </p>
            {discount && (
              <p className="mb-0 text-muted small">
                <s>Rp {price.toLocaleString("id-ID")}</s>
              </p>
            )}
          </div>

          <a
            href={stock === 0 ? undefined : whatsAppLink}
            className={`btn ${
              stock === 0 ? "btn-secondary disabled" : "buy-button"
            } mt-2 w-100 fw-bold py-2 text-decoration-none`}
            style={{ color: stock === 0 ? undefined : "inherit" }}
            onClick={(e) => {
              if (stock === 0) e.preventDefault();
            }}
            role="button"
            aria-disabled={stock === 0}
          >
            {stock === 0 ? (
              "Stok Habis"
            ) : (
              <>
                <i className="bi bi-cart-plus me-2"></i>Beli Sekarang
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
