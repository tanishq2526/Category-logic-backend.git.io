import React from "react";

export default function UserDetailsCard({ order }) {
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
      <h3 style={titleStyle}>User Details</h3>
      <div style={detailGrid}>
        <InfoRow label="Name" value={order.userName} />
        <InfoRow label="Address" value={order.userAddress} />
        <InfoRow label="Phone" value={order.phone} />
        <InfoRow label="Email" value={order.email} />
        <InfoRow label="Product" value={order.productName} />
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
