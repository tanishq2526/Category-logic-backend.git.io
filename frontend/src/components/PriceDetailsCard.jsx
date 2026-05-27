import React from "react";

export default function PriceDetailsCard({ order }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
      }}
    >
      <h3 style={titleStyle}>Price Details</h3>
      <div style={detailGrid}>
        <InfoRow label="GST" value={`₹${order.gst.toLocaleString()}`} />
        <InfoRow label="Discount" value={`- ₹${order.discount.toLocaleString()}`} />
        <InfoRow label="Coupon Discount" value={`- ₹${order.couponDiscount.toLocaleString()}`} />
        <InfoRow label="Actual Price" value={`₹${order.actualPrice.toLocaleString()}`} />
        <InfoRow label="Total Price" value={`₹${order.totalPrice.toLocaleString()}`} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
      <span style={{ color: "#475569", fontSize: "13px", fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ color: "#0f172a", fontSize: "15px", lineHeight: 1.6 }}>
        {value}
      </span>
    </div>
  );
}

const titleStyle = {
  margin: 0,
  marginBottom: "18px",
  fontSize: "16px",
  fontWeight: 700,
  color: "#0f172a",
};

const detailGrid = {
  display: "grid",
  gap: "14px",
};
