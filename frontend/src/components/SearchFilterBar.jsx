import React from "react";

const filterOptionStyle = {
  minWidth: "180px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  fontSize: "14px",
};

export default function SearchFilterBar({
  searchQuery,
  orderStatus,
  paymentStatus,
  date,
  onSearchChange,
  onOrderStatusChange,
  onPaymentStatusChange,
  onDateChange,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
        gap: "16px",
        alignItems: "center",
        marginTop: "22px",
        marginBottom: "22px",
      }}
    >
      <input
        type="search"
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        style={{
          ...filterOptionStyle,
          width: "100%",
          minWidth: "240px",
          paddingLeft: "16px",
          boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
        }}
      />

      <select
        value={orderStatus}
        onChange={(event) => onOrderStatusChange(event.target.value)}
        style={filterOptionStyle}
      >
        <option value="">All Order Status</option>
        <option value="Ordered">Ordered</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>

      <select
        value={paymentStatus}
        onChange={(event) => onPaymentStatusChange(event.target.value)}
        style={filterOptionStyle}
      >
        <option value="">All Payment Status</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
        style={filterOptionStyle}
      />
    </div>
  );
}
