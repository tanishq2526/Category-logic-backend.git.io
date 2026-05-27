import React from "react";

const statusStyles = {
  Ordered: { color: "#0c4a6e", background: "#e0f2fe" },
  Shipped: { color: "#5b21b6", background: "#ede9fe" },
  Delivered: { color: "#166534", background: "#d1fae5" },
};

export default function StatusTracker({ status }) {
  const steps = ["Ordered", "Shipped", "Delivered"];

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
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          Product Status
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px" }}>
          Track the delivery progress and current order stage.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {steps.map((step, index) => {
          const active = step === status;
          const completed = steps.indexOf(status) > index;
          return (
            <div
              key={step}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: active ? statusStyles[step].background : "#f8fafc",
                  border: active ? `2px solid ${statusStyles[step].color}` : "2px solid #e2e8f0",
                  display: "grid",
                  placeItems: "center",
                  color: active ? statusStyles[step].color : "#64748b",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: active ? 700 : 600,
                  color: active ? "#0f172a" : "#64748b",
                  textAlign: "center",
                }}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-50%",
                    top: "24px",
                    width: "100%",
                    height: "4px",
                    background: completed ? "#2563eb" : "#e2e8f0",
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
