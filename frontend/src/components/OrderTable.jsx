const badgeStyles = {
  Paid: { background: "#d1fae5", color: "#047857" },
  Pending: { background: "#fef3c7", color: "#b45309" },
  Failed: { background: "#fee2e2", color: "#b91c1c" },
  Ordered: { background: "#e0f2fe", color: "#0c4a6e" },
  Processing: { background: "#fef9c3", color: "#854d0e" },
  Shipped: { background: "#ede9fe", color: "#5b21b6" },
  Delivered: { background: "#d1fae5", color: "#166534" },
  Cancelled: { background: "#fee2e2", color: "#b91c1c" },
};

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function StatusBadge({ value }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        ...badgeStyles[value],
      }}
    >
      {value}
    </span>
  );
}

export default function OrderTable({
  orders,
  loading,
  onViewDetails,
  onStatusChange,
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (loading) {
    return (
      <div
        style={{
          minHeight: "260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center", color: "#475569" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "4px solid #6366f1",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading orders...
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div
        style={{
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          color: "#64748b",
          fontSize: "15px",
        }}
      >
        No orders match your filter. Try a different search or status.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        overflowX: "auto",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
      }}
    >
      <table style={{ width: "100%", minWidth: "1020px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={headerCell}>Order ID</th>
            <th style={headerCell}>User ID</th>
            <th style={headerCell}>Product ID</th>
            <th style={headerCell}>Product Price</th>
            <th style={headerCell}>Phone Number</th>
            <th style={headerCell}>Date</th>
            <th style={headerCell}>Payment Status</th>
            <th style={headerCell}>Order Status</th>
            <th style={headerCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              style={{
                transition: "background 0.18s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
              }}
            >
              <td style={bodyCell}>{order.id}</td>
              <td style={bodyCell}>{order.userId}</td>
              <td style={bodyCell}>{order.productId}</td>
              <td style={bodyCell}>₹{order.price.toLocaleString()}</td>
              <td style={bodyCell}>{order.phone}</td>
              <td style={bodyCell}>{order.date}</td>
              <td style={bodyCell}>
                <StatusBadge value={order.paymentStatus} />
              </td>
              <td style={bodyCell}>
                <select
                  value={order.orderStatus}
                  onChange={(event) =>
                    onStatusChange?.(order.id, event.target.value)
                  }
                  style={{
                    ...statusSelect,
                    ...badgeStyles[order.orderStatus],
                    borderColor: "#e2e8f0",
                    background: badgeStyles[order.orderStatus]?.background || "#f8fafc",
                    color: badgeStyles[order.orderStatus]?.color || "#1f2937",
                  }}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td style={bodyCell}>
                <button
                  onClick={() => onViewDetails(order)}
                  style={viewButton}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          padding: "16px 20px",         borderTop: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            ...pageButton,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>
        <span style={{ color: "#475569", fontSize: "14px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            ...pageButton,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const headerCell = {
  padding: "16px 18px",
  textAlign: "left",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  borderBottom: "1px solid #e2e8f0",
};

const bodyCell = {
  padding: "16px 18px",
  color: "#1f2937",
  fontSize: "14px",
  borderBottom: "1px solid #f1f5f9",
};

const statusSelect = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  appearance: "none",
};

const viewButton = {
  border: "none",
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};

const pageButton = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  padding: "10px 16px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#475569",
};
