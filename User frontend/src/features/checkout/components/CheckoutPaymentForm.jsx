import { ShieldCheck, Lock, CreditCard, Banknote } from "lucide-react";

const CheckoutPaymentForm = ({ paymentMethod, setPaymentMethod, handlePaymentSubmit }) => {
  return (
    <form onSubmit={handlePaymentSubmit} className="checkout-step-form">
      <div className="checkout-section">
        <h2 className="checkout-section-title">Payment Method</h2>
        <p className="checkout-section-desc-light">
          Choose how you would like to pay for your order.
        </p>

        <div className="checkout-payment-methods-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Razorpay Option */}
          <div 
            className={`checkout-payment-method-card ${paymentMethod === "Razorpay" ? "active" : ""}`}
            onClick={() => setPaymentMethod("Razorpay")}
            style={{ cursor: "pointer", border: paymentMethod === "Razorpay" ? "2px solid #1f2a44" : "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: paymentMethod === "Razorpay" ? "#f8fafc" : "#fff" }}
          >
            <div className="payment-method-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="payment-method-radio-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className={`payment-method-custom-radio ${paymentMethod === "Razorpay" ? "checked" : ""}`} style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #1f2a44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {paymentMethod === "Razorpay" && <div className="radio-inner-dot" style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1f2a44" }}></div>}
                </div>
                <div className="payment-method-title-wrap" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="payment-method-name" style={{ fontWeight: 600, fontSize: "14px", color: "#1f2a44" }}>Pay Online</span>
                  <span className="payment-method-subtitle" style={{ fontSize: "12px", color: "#64748b" }}>Cards, UPI, Netbanking, Wallets</span>
                </div>
              </div>
              <ShieldCheck size={18} className="payment-method-shield-icon" style={{ color: "#1f2a44" }} />
            </div>

            {paymentMethod === "Razorpay" && (
              <div className="payment-method-card-body" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                <p className="payment-method-explanation" style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5", marginBottom: "12px" }}>
                  Upon clicking "Place Order & Pay" in the next step, you will transact through Razorpay's secure modal.
                </p>
                <div className="payment-method-gateways-row" style={{ display: "flex", gap: "8px" }}>
                  <span className="gateway-badge" style={{ fontSize: "10px", padding: "4px 8px", background: "#e2e8f0", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>CARDS</span>
                  <span className="gateway-badge" style={{ fontSize: "10px", padding: "4px 8px", background: "#e2e8f0", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>UPI</span>
                  <span className="gateway-badge" style={{ fontSize: "10px", padding: "4px 8px", background: "#e2e8f0", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>NETBANKING</span>
                </div>
              </div>
            )}
          </div>

          {/* COD Option */}
          <div 
            className={`checkout-payment-method-card ${paymentMethod === "COD" ? "active" : ""}`}
            onClick={() => setPaymentMethod("COD")}
            style={{ cursor: "pointer", border: paymentMethod === "COD" ? "2px solid #1f2a44" : "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: paymentMethod === "COD" ? "#f8fafc" : "#fff" }}
          >
            <div className="payment-method-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="payment-method-radio-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className={`payment-method-custom-radio ${paymentMethod === "COD" ? "checked" : ""}`} style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #1f2a44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {paymentMethod === "COD" && <div className="radio-inner-dot" style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1f2a44" }}></div>}
                </div>
                <div className="payment-method-title-wrap" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="payment-method-name" style={{ fontWeight: 600, fontSize: "14px", color: "#1f2a44" }}>Cash on Delivery (COD)</span>
                  <span className="payment-method-subtitle" style={{ fontSize: "12px", color: "#64748b" }}>Pay at your doorstep</span>
                </div>
              </div>
              <Banknote size={18} className="payment-method-shield-icon" style={{ color: "#1f2a44" }} />
            </div>

            {paymentMethod === "COD" && (
              <div className="payment-method-card-body" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                <p className="payment-method-explanation" style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
                  You can pay in cash or via UPI to the delivery executive when your order arrives. Please keep the exact change ready if paying in cash.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="checkout-features-compact" style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="checkout-feature-item-compact" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#475569" }}>
            <Lock size={13} className="promise-icon-gold" style={{ color: "#d97706" }} />
            <span>Signature Verified Encryption</span>
          </div>
          <div className="checkout-feature-item-compact" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#475569" }}>
            <ShieldCheck size={13} className="promise-icon-gold" style={{ color: "#d97706" }} />
            <span>Zero Card Storage (PCI Compliant)</span>
          </div>
        </div>
      </div>

      <button type="submit" className="checkout-continue-btn" style={{ width: "100%", padding: "14px", background: "#1f2a44", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, marginTop: "24px", cursor: "pointer" }}>
        CONTINUE TO REVIEW
      </button>
    </form>
  );
};

export default CheckoutPaymentForm;
