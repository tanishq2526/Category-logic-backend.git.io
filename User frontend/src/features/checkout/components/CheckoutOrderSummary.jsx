import { useState } from "react";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Clock,
  Minus,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import OptimizedImage from "@/shared/components/ui/OptimizedImage";
import { formatPrice } from "../../../utils/pricing";

export default function CheckoutOrderSummary({
  cartItems,
  cartSubtotal,
  shippingMethod,
  shippingCost,
  tax,
  total,
  updateQuantity,
  removeFromCart,
  discount = 0,
  giftCardDiscount = 0,
  couponCode,
  giftCardCode,
  applyCoupon,
  removeCoupon,
  applyGiftcard,
  removeGiftcard,
  isApplyingCoupon,
  isRemovingCoupon,
  isApplyingGiftcard,
  isRemovingGiftcard,
}) {
  const [couponInput, setCouponInput] = useState("");
  const [giftCardInput, setGiftCardInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [giftCardError, setGiftCardError] = useState("");

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    try {
      await applyCoupon(couponInput);
      setCouponInput("");
    } catch (err) {
      setCouponError(err.message || "Invalid coupon");
    }
  };

  const handleApplyGiftcard = async (e) => {
    e.preventDefault();
    setGiftCardError("");
    try {
      await applyGiftcard(giftCardInput);
      setGiftCardInput("");
    } catch (err) {
      setGiftCardError(err.message || "Invalid gift card");
    }
  };

  // Calculate dynamic estimated delivery dates (standard shipping = 3 to 7 days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + 3);
    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + 7);

    const options = { month: "short", day: "numeric" };
    return `${minDelivery.toLocaleDateString("en-US", options)} – ${maxDelivery.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="checkout-right">
      <div className="checkout-summary-card">
        <h2 className="checkout-summary-title">Order Summary</h2>

        <div className="checkout-order-items">
          {cartItems.map((item, index) => (
            <div key={index} className="checkout-order-item">
              <div className="checkout-item-image">
                <OptimizedImage src={item.image} alt={item.name} />
              </div>
              <div className="checkout-item-details">
                <h4 className="checkout-item-name">{item.name}</h4>
                <div className="checkout-item-specs">
                  {item.color && (
                    <span className="checkout-item-spec">Color: {item.color}</span>
                  )}
                  {item.size && (
                    <span className="checkout-item-spec">Size: {item.size}</span>
                  )}
                </div>
                <div className="checkout-item-qty-controls">
                  <button
                    type="button"
                    className="checkout-qty-btn"
                    onClick={() =>
                      updateQuantity({
                        productId: item.product,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity - 1,
                        itemId: item._id,
                      })
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="checkout-qty-value">{item.quantity}</span>
                  <button
                    type="button"
                    className="checkout-qty-btn"
                    onClick={() =>
                      updateQuantity({
                        productId: item.product,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity + 1,
                        itemId: item._id,
                      })
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    type="button"
                    className="checkout-remove-btn"
                    onClick={() =>
                      removeFromCart({
                        productId: item.product,
                        size: item.size,
                        color: item.color,
                        itemId: item._id,
                      })
                    }
                    aria-label="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="checkout-item-price">
                {formatPrice(
                  (Number(item.finalPrice || item.price) || 0) * (Number(item.quantity) || 0)
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-divider"></div>

        {/* Estimated Delivery Information */}
        <div className="checkout-delivery-estimate-box">
          <Calendar size={15} />
          <span>
            ESTIMATED DELIVERY: <strong>{getEstimatedDelivery()}</strong>
          </span>
        </div>

        <div className="checkout-divider"></div>

        {/* PROMO CODES */}
        <div className="checkout-promo-section">
          {/* Coupon */}
          <div className="promo-block" style={{ marginBottom: "15px" }}>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontWeight: "600", color: "var(--ds-color-secondary, #4a4a4a)" }}>Discount Coupon</h4>
            {couponCode ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", fontWeight: "500", fontSize: "14px" }}>
                  <ShieldCheck size={16} />
                  <span>{couponCode}</span>
                </div>
                <button 
                  onClick={() => removeCoupon()}
                  disabled={isRemovingCoupon}
                  style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
                >
                  {isRemovingCoupon ? "Removing..." : "Remove"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code" 
                  style={{ flex: 1, padding: "10px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", fontSize: "14px", outline: "none" }}
                />
                <button 
                  type="submit"
                  disabled={!couponInput || isApplyingCoupon}
                  style={{ padding: "0 16px", backgroundColor: "var(--ds-color-primary, #000)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", opacity: (!couponInput || isApplyingCoupon) ? 0.5 : 1 }}
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              </form>
            )}
            {couponError && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{couponError}</p>}
          </div>

          {/* Gift Card */}
          <div className="promo-block">
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontWeight: "600", color: "var(--ds-color-secondary, #4a4a4a)" }}>Gift Card</h4>
            {giftCardCode ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", fontWeight: "500", fontSize: "14px" }}>
                  <ShieldCheck size={16} />
                  <span>{giftCardCode}</span>
                </div>
                <button 
                  onClick={() => removeGiftcard()}
                  disabled={isRemovingGiftcard}
                  style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
                >
                  {isRemovingGiftcard ? "Removing..." : "Remove"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyGiftcard} style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={giftCardInput}
                  onChange={(e) => setGiftCardInput(e.target.value.toUpperCase())}
                  placeholder="Enter gift card" 
                  style={{ flex: 1, padding: "10px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", fontSize: "14px", outline: "none" }}
                />
                <button 
                  type="submit"
                  disabled={!giftCardInput || isApplyingGiftcard}
                  style={{ padding: "0 16px", backgroundColor: "var(--ds-color-primary, #000)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", opacity: (!giftCardInput || isApplyingGiftcard) ? 0.5 : 1 }}
                >
                  {isApplyingGiftcard ? "Applying..." : "Apply"}
                </button>
              </form>
            )}
            {giftCardError && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{giftCardError}</p>}
          </div>
        </div>

        <div className="checkout-divider"></div>

        <div className="checkout-totals">
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartSubtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="checkout-total-row">
              <span>Coupon Discount</span>
              <span style={{ color: "var(--ds-color-success, #047857)" }}>
                -{formatPrice(discount)}
              </span>
            </div>
          )}
          {giftCardDiscount > 0 && (
            <div className="checkout-total-row">
              <span>Gift Card</span>
              <span style={{ color: "var(--ds-color-success, #047857)" }}>
                -{formatPrice(giftCardDiscount)}
              </span>
            </div>
          )}
          <div className="checkout-total-row">
            <span>Shipping</span>
            <span>
              {shippingCost === 0
                ? "Free"
                : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="checkout-total-row">
            <span>Tax (18% GST)</span>
            <span>{formatPrice(tax)}</span>
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-total-row checkout-total-amount">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Trust Badges & Secure Checkout Panel */}
        <div className="checkout-security-panel">
          <div className="checkout-secure-header">
            <Lock size={14} className="checkout-secure-lock-icon" />
            <span className="checkout-secure-header-title">SECURE GATEWAY ENCRYPTION</span>
          </div>
          <p className="checkout-security-description">
            Your connection is encrypted with 256-bit SSL protocol. Payments are verified securely in real-time.
          </p>
          
          {/* SVG Payment Badges Grid */}
          <div className="checkout-payment-logos-grid">
            {/* Visa */}
            <svg className="payment-logo-svg visa" viewBox="0 0 48 16" width="34" height="12">
              <path fill="#1A1F71" d="M18.2 1.3L15.3 15h-2.5L10.3 4.2C9.9 3 9.7 2.7 8.8 2.2c-1.5-.8-3.9-1.5-6-2L3 0h6.2c1.4 0 2.6.9 2.9 2.5l1.8 9.5 4.8-12h2.5zm11 10.3c0-2.8-3.8-2.9-3.7-4.2.1-.4.4-.7 1.2-.8 1.9-.3 3.8.3 4.8.8l.8-2.6c-1.3-.5-3-.9-4.7-.9-3.1 0-5.3 1.7-5.3 4.1-.1 3.5 4.8 3.7 4.8 5.6 0 .6-.5.9-1.4.9-2.3 0-4.1-.6-5.4-1.2l-.9 2.7c1.5.7 3.5 1.1 5.4 1.1 3.3 0 5.8-1.6 5.8-3.9m8.3 3.4h2.4L42 1.3H39.8c-.8 0-1.4.5-1.7 1.2L33.7 15h2.5l.8-2.3h5.7l-.4 2.3zm-4.1-4.7L39.8 4l1.1 6.3h-4.5zM7.3 1.3H2.8L2.5 2C5 8.1 7.1 12.2 7.7 15h2.6L7.3 1.3z"/>
              <path fill="#D78216" d="M7.7 15c-.6-2.8-2.7-6.9-5.2-13H2.8H7.3L10.3 15H7.7z" opacity="0.1"/>
            </svg>
            
            {/* Mastercard */}
            <svg className="payment-logo-svg mastercard" viewBox="0 0 32 20" width="28" height="18">
              <circle cx="10" cy="10" r="10" fill="#EB001B" />
              <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85" />
            </svg>

            {/* RuPay */}
            <div className="rupay-logo-text">RuPay</div>

            {/* UPI */}
            <div className="upi-logo-text">UPI</div>

            {/* Razorpay Secured */}
            <div className="razorpay-logo-badge">
              <ShieldCheck size={11} style={{ marginRight: 3 }} />
              <span>Razorpay Secured</span>
            </div>
          </div>
        </div>

        {/* Brand Promises */}
        <div className="checkout-brand-promises">
          <div className="checkout-promise-item">
            <Truck size={15} />
            <div>
              <p className="checkout-promise-title">Free Standard Delivery</p>
              <p className="checkout-promise-desc">Complimentary for all purchases above {formatPrice(1000)}</p>
            </div>
          </div>

          <div className="checkout-promise-item">
            <RotateCcw size={15} />
            <div>
              <p className="checkout-promise-title">Complimentary Returns</p>
              <p className="checkout-promise-desc">30-day elegant returns and size exchanges</p>
            </div>
          </div>

          <div className="checkout-promise-item">
            <Clock size={15} />
            <div>
              <p className="checkout-promise-title">Concierge Customer Support</p>
              <p className="checkout-promise-desc">Available 24/7 to assist with your ordering inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
