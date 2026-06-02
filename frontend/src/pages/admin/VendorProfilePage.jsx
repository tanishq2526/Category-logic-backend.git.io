/*
 * pages/admin/VendorProfilePage.jsx
 *
 * Shows the full detail view for a single vendor.
 * Data is fetched from:  GET /api/admin/vendors/:id
 *
 * The :id comes from useParams() and is the vendor's MongoDB _id,
 * passed through from VendorManagementPage when "View Profile →" is clicked.
 *
 * API response shape (vendor document with populated user):
 *   data: {
 *     _id, shopName, slug, description, logo, banner, status,
 *     commissionRate, address, city, pincode,
 *     businessPhone, businessEmail, websiteUrl,
 *     createdAt, updatedAt,
 *     user: { _id, name, email, phone, createdAt }
 *   }
 *
 * Tabs that show real data:   BUSINESS INFORMATION, DETAILS
 * Tabs that are placeholders: ANALISE, PRODUCTS, CATEGORY, SUB-CATEGORY, COUPON, ORDERS
 * (Those tabs would need their own API endpoints — wire them up when ready.)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarFallback = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "V")}&background=1e293b&color=fff&size=256&bold=true`;

// Format an ISO date string into a readable date, e.g. "28 May 2026"
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active: { bg: "#dcfce7", color: "#166534", label: "Active" },
  suspended: { bg: "#fee2e2", color: "#991b1b", label: "Suspended" },
  pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      style={{
        padding: "4px 14px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
};

// ─── Info field (label + rounded box) ────────────────────────────────────────

const InfoField = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#334155",
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 24,
        padding: "12px 20px",
        fontSize: 15,
        color: "#0f172a",
        backgroundColor: "#fff",
      }}
    >
      {value || "—"}
    </div>
  </div>
);

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  "ANALISE",
  "BUSINESS INFORMATION",
  "PRODUCTS",
  "CATEGORY",
  "SUB-CATEGORY",
  "COUPON",
  "ORDERS",
  "DETAILS",
];

// ─── Main component ───────────────────────────────────────────────────────────

const VendorProfilePage = () => {
  const { id } = useParams(); // MongoDB _id from the URL
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ANALISE");

  // ── Fetch vendor data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/admin/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load vendor.");
          return;
        }

        setVendor(data.data);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
          padding: "32px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              margin: "0 auto 16px",
              border: "4px solid #e2e8f0",
              borderTopColor: "#6366f1",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontSize: 15 }}>Loading vendor profile…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
          padding: "32px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          ← Back to Vendors
        </button>
        <div
          style={{
            background: "#fff1f0",
            border: "1px solid #ffa39e",
            borderRadius: 12,
            padding: "24px",
            color: "#cf1322",
            fontSize: 15,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  // Destructure the vendor and its populated user for convenience
  const user = vendor?.user || {};

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "32px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#000",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to Vendors
      </button>

      {/* ── Main card ── */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        {/* ── TOP: Profile header ── */}
        <div
          style={{
            padding: 32,
            display: "flex",
            gap: 32,
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Logo / avatar */}
          <div
            style={{
              width: 160,
              height: 200,
              border: "1.5px solid #cbd5e1",
              borderRadius: 12,
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "#fff",
            }}
          >
            <img
              src={vendor.logo || avatarFallback(user.name)}
              alt={vendor.shopName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info fields grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              flex: 1,
            }}
          >
            <InfoField label="Vendor Name" value={user.name} />
            <InfoField label="Shop Name" value={vendor.shopName} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Vendor ID
              </span>
              <div
                style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: 24,
                  padding: "12px 20px",
                  fontSize: 13,
                  color: "#94a3b8",
                  backgroundColor: "#fff",
                  fontFamily: "monospace",
                }}
              >
                {vendor._id}
              </div>
            </div>
            <InfoField label="Email" value={user.email} />
            <InfoField label="Phone" value={user.phone} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Status
              </span>
              <div
                style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: 24,
                  padding: "10px 20px",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <StatusBadge status={vendor.status} />
              </div>
            </div>
            <InfoField label="Join Date" value={formatDate(user.createdAt)} />
            <InfoField
              label="Commission"
              value={`${vendor.commissionRate ?? 10}%`}
            />
          </div>
        </div>

        {/* ── MIDDLE: Tab bar ── */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflowX: "auto",
          }}
        >
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "16px 8px",
                fontSize: 11,
                fontWeight: activeTab === tab ? 700 : 600,
                color: activeTab === tab ? "#000" : "#64748b",
                backgroundColor: activeTab === tab ? "#f8fafc" : "#fff",
                border: "none",
                borderRight:
                  index < TABS.length - 1 ? "1px solid #e2e8f0" : "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #000"
                    : "2px solid transparent",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                transition: "all 0.15s",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 56,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── BOTTOM: Tab content ── */}
        <div
          style={{
            flex: 1,
            padding: 32,
            backgroundColor: "#fff",
            overflowY: "auto",
          }}
        >
          {/* ANALISE — placeholder (no analytics API yet) */}
          {activeTab === "ANALISE" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
              }}
            >
              {[
                { label: "Total Revenue", value: "—" },
                { label: "Total Orders", value: "—" },
                { label: "Average Rating", value: "—" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px",
                      color: "#64748b",
                      fontSize: 13,
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#94a3b8",
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
              <p
                style={{
                  gridColumn: "1/-1",
                  color: "#94a3b8",
                  fontSize: 13,
                  margin: 0,
                }}
              >
                Analytics coming soon — wire up an analytics API endpoint to
                populate this tab.
              </p>
            </div>
          )}

          {/* BUSINESS INFORMATION — real data from the vendor document */}
          {activeTab === "BUSINESS INFORMATION" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <InfoField label="Shop Description" value={vendor.description} />
              <InfoField label="Website" value={vendor.websiteUrl} />
              <InfoField label="Business Email" value={vendor.businessEmail} />
              <InfoField label="Business Phone" value={vendor.businessPhone} />
              <InfoField label="Address" value={vendor.address} />
              <InfoField label="City" value={vendor.city} />
              <InfoField label="Pincode" value={vendor.pincode} />
              <InfoField label="Shop Slug" value={vendor.slug} />
            </div>
          )}

          {/* PRODUCTS — placeholder */}
          {activeTab === "PRODUCTS" && (
            <PlaceholderTab message="Connect to the vendor products API endpoint to show products here." />
          )}

          {/* CATEGORY — placeholder */}
          {activeTab === "CATEGORY" && (
            <PlaceholderTab message="Connect to the vendor categories API endpoint to show categories here." />
          )}

          {/* SUB-CATEGORY — placeholder */}
          {activeTab === "SUB-CATEGORY" && (
            <PlaceholderTab message="Connect to the vendor sub-categories API endpoint to show sub-categories here." />
          )}

          {/* COUPON — placeholder */}
          {activeTab === "COUPON" && (
            <PlaceholderTab message="Connect to the vendor coupons API endpoint to show coupons here." />
          )}

          {/* ORDERS — placeholder */}
          {activeTab === "ORDERS" && (
            <PlaceholderTab message="Connect to the vendor orders API endpoint to show orders here." />
          )}

          {/* DETAILS — real data: timestamps and commission */}
          {activeTab === "DETAILS" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <InfoField
                label="Registered On"
                value={formatDate(vendor.createdAt)}
              />
              <InfoField
                label="Last Updated"
                value={formatDate(vendor.updatedAt)}
              />
              <InfoField
                label="Commission Rate"
                value={`${vendor.commissionRate ?? 10}%`}
              />
              <InfoField label="Account Status" value={vendor.status} />
              {vendor.banner && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#334155",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Shop Banner
                  </span>
                  <img
                    src={vendor.banner}
                    alt="banner"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Reusable placeholder tab ─────────────────────────────────────────────────

const PlaceholderTab = ({ message }) => (
  <div
    style={{
      padding: 32,
      border: "1px dashed #cbd5e1",
      borderRadius: 16,
      textAlign: "center",
      color: "#94a3b8",
      backgroundColor: "#f8fafc",
    }}
  >
    <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
  </div>
);

export default VendorProfilePage;
