import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UserDetailsCard from "../../components/UserDetailsCard";
import BusinessAddressCard from "../../components/BusinessAddressCard";
import PriceDetailsCard from "../../components/PriceDetailsCard";
import StatusTracker from "../../components/StatusTracker";

// Minimal fallback dataset (only used if no location state provided)
const fallbackOrders = [];

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order || fallbackOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>Back</button>
        <div style={{ background: "white", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <h2 style={{ marginTop: 0 }}>Order not found</h2>
          <p style={{ color: "#64748b" }}>No order data was provided. Return to the orders list and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{order.id}</h1>
          <p style={{ margin: 0, color: "#64748b" }}>Order details and fulfillment information</p>
        </div>
        <div>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>Back to Orders</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 20 }}>
        <UserDetailsCard order={order} />
        <BusinessAddressCard order={order} />
        <PriceDetailsCard order={order} />
      </div>

      <StatusTracker status={order.orderStatus} />
    </div>
  );
}
