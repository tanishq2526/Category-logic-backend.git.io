import React from "react";
import UserDetailsCard from "./UserDetailsCard";
import BusinessAddressCard from "./BusinessAddressCard";
import PriceDetailsCard from "./PriceDetailsCard";
import StatusTracker from "./StatusTracker";

export default function OrderDetailCard({ order }) {
  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
        }}
      >
        <UserDetailsCard order={order} />
        <BusinessAddressCard order={order} />
        <PriceDetailsCard order={order} />
      </div>

      <StatusTracker status={order.orderStatus} />
    </div>
  );
}
