import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_VENDORS = [
  { id: "BBE4D781", name: "Sandeep", firmName: "Sandeep Enterprises", email: "testuser2@gmail.com", status: "Deactive" },
  { id: "8D333701", name: "Test User", firmName: "Test Co.", email: "testuser@gmail.com", status: "Deactive" },
  { id: "F9F531FD", name: "Tanishq Soni", firmName: "Tanishq Traders", email: "tanishq.25.ts@gmail.com", status: "Active" },
  { id: "95B47E65", name: "Tanishq soni", firmName: "TS Logistics", email: "tanishq@example.com", status: "Deactive" },
  { id: "A1B2C3D4", name: "Rahul Verma", firmName: "Verma Suppliers", email: "rahul.v@example.com", status: "Active" },
  { id: "E5F6G7H8", name: "Amit Sharma", firmName: "Sharma Electronics", email: "amit.sharma@example.com", status: "Active" },
];

const avatarFallback = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=1e293b&color=fff&size=128&bold=true`;

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_MAP = {
  Active:   { bg: "#e6f4ff", color: "#0958d9", border: "#91caff", icon: "✨" },
  Deactive: { bg: "#f5f5f5", color: "#595959", border: "#d9d9d9", icon: "💤" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.Deactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {s.icon} {status || "Deactive"}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, accent, icon, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: "1 1 160px", minWidth: 140,
      background: active ? accent : "#fff",
      borderRadius: 14, border: `2px solid ${active ? accent : "#e5e7eb"}`,
      padding: "18px 20px", cursor: onClick ? "pointer" : "default",
      textAlign: "left", transition: "all .18s",
      boxShadow: active ? `0 4px 14px ${accent}33` : "0 1px 4px rgba(0,0,0,.06)",
    }}
  >
    <div style={{ fontSize: 26, lineHeight: 1 }}>{icon}</div>
    <div style={{
      fontSize: 30, fontWeight: 800, lineHeight: 1.1, marginTop: 8,
      color: active ? "#fff" : accent,
    }}>{value ?? "…"}</div>
    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: active ? "#ffffffcc" : "#6b7280" }}>
      {label}
    </div>
  </button>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: "All",      value: "",         icon: "👥", statsKey: "total",    accent: "#6366f1" },
  { label: "Active",   value: "Active",   icon: "✨", statsKey: "active",   accent: "#0958d9" },
  { label: "Deactive", value: "Deactive", icon: "💤", statsKey: "deactive", accent: "#595959" },
];

const VendorManagementPage = () => {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page,         setPage]         = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Compute filtered vendors locally
  const filteredVendors = useMemo(() => {
    return DUMMY_VENDORS.filter(v => {
      // Filter by status
      if (statusFilter && v.status !== statusFilter) return false;
      // Filter by search (name or email)
      if (search) {
        const lowerSearch = search.toLowerCase();
        if (!v.name.toLowerCase().includes(lowerSearch) && !v.email.toLowerCase().includes(lowerSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [search, statusFilter]);

  // Pagination
  const pages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;
  const paginatedVendors = filteredVendors.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const stats = {
    total: DUMMY_VENDORS.length,
    active: DUMMY_VENDORS.filter(v => v.status === "Active").length,
    deactive: DUMMY_VENDORS.filter(v => v.status === "Deactive").length,
  };

  const handleSearchChange = (val) => { setSearch(val); setPage(1); };
  const handleTabClick     = (val) => { setStatusFilter(val); setPage(1); };

  const TABLE_COLS = ["User ID", "Name", "Firm Name", "Email", "Status", "Action"];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#f1f5f9", minHeight: "100vh",
      padding: "28px 32px", color: "#0f172a",
    }}>

      {/* ── Page title ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -.5 }}>Vendors Profile</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "5px 0 0" }}>
          Manage your vendors, view their details, and track their status.
        </p>
      </div>

      {/* ── Stat / filter tabs ── */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {FILTER_TABS.map((tab) => (
          <StatCard
            key={tab.value}
            label={`${tab.icon} ${tab.label} Vendors`}
            value={stats[tab.statsKey]}
            accent={tab.accent}
            active={statusFilter === tab.value}
            onClick={() => handleTabClick(tab.value)}
          />
        ))}
      </div>

      {/* ── Search bar ── */}
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
        padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#94a3b8" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1px solid #e2e8f0", borderRadius: 8,
              padding: "9px 12px 9px 36px", fontSize: 14,
              outline: "none", background: "#f8fafc", color: "#0f172a",
            }}
          />
        </div>
        {search && (
          <button
            onClick={() => handleSearchChange("")}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13 }}
          >
            ✕ Clear
          </button>
        )}
        <span style={{ fontSize: 13, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: "auto" }}>
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,.05)", overflow: "hidden",
      }}>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {TABLE_COLS.map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: "#64748b",
                    textTransform: "uppercase", letterSpacing: .5,
                    borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.length === 0 && (
                <tr>
                  <td colSpan={TABLE_COLS.length} style={{ padding: 50, textAlign: "center", color: "#94a3b8", fontSize: 15 }}>
                    No vendors found.
                  </td>
                </tr>
              )}

              {paginatedVendors.map((u, i) => (
                <tr key={u.id} style={{
                  borderBottom: "1px solid #f1f5f9",
                  background: i % 2 === 0 ? "#fff" : "#fafbfc",
                  transition: "background .12s",
                }}>
                  {/* User ID */}
                  <td style={{ padding: "13px 16px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>
                    #{u.id}
                  </td>

                  {/* Name + Avatar */}
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={avatarFallback(u.name)}
                        alt={u.name}
                        style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0", flexShrink: 0 }}
                      />
                      <span style={{ fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{u.name}</span>
                    </div>
                  </td>

                  {/* Firm Name */}
                  <td style={{ padding: "13px 16px", color: "#475569", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {u.firmName}
                  </td>

                  {/* Email */}
                  <td style={{ padding: "13px 16px", color: "#475569", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "13px 16px" }}>
                    <StatusBadge status={u.status} />
                  </td>

                  {/* Action */}
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      style={{
                        background: "#6366f1", color: "#fff", border: "none",
                        padding: "7px 14px", borderRadius: 8, fontSize: 12,
                        fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
                      onClick={() => navigate(`/admin/vendors/${u.id}`)}
                    >
                      View Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: 6, padding: "16px 20px", borderTop: "1px solid #f1f5f9",
          }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: "7px 16px", border: "1px solid #e2e8f0", borderRadius: 8,
                background: "#fff", cursor: page <= 1 ? "not-allowed" : "pointer",
                opacity: page <= 1 ? .4 : 1, fontSize: 13, fontWeight: 600,
              }}
            >← Prev</button>

            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 34, height: 34, borderRadius: 8, fontSize: 13,
                  cursor: "pointer", fontWeight: p === page ? 800 : 500,
                  border: p === page ? "none" : "1px solid #e2e8f0",
                  background: p === page ? "#6366f1" : "#fff",
                  color: p === page ? "#fff" : "#374151",
                }}
              >{p}</button>
            ))}

            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: "7px 16px", border: "1px solid #e2e8f0", borderRadius: 8,
                background: "#fff", cursor: page >= pages ? "not-allowed" : "pointer",
                opacity: page >= pages ? .4 : 1, fontSize: 13, fontWeight: 600,
              }}
            >Next →</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default VendorManagementPage;
