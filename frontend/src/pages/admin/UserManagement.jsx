import { useState, useEffect } from "react";
import API from "../../utils/api";

const S = { fontFamily: "'Outfit', sans-serif" };

// ─── Icons ────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MoreVertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

// ─── KPI Card Component ────────────────────────────────────────────────────
function KPICard({ label, value, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        border: `1px solid ${color}33`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        flex: 1,
        minWidth: "200px",
      }}
    >
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>
        {label}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "700", color: color }}>
        {value}
      </div>
    </div>
  );
}

// ─── Search & Filter Bar ───────────────────────────────────────────────────
function SearchFilterBar({ onSearch, onFilterChange, filters }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid #e2e8f0",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#f8fafc",
              borderRadius: "8px",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by ID, name, email, or phone..."
              onChange={(e) => onSearch(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                padding: "10px 12px",
                flex: 1,
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            <FilterIcon />
            Filters
          </button>
        </div>

        {showAdvanced && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
                background: "white",
                cursor: "pointer",
              }}
            >
              <option value="">All Status</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="deactive">Deactive</option>
            </select>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              onChange={(e) => onFilterChange("tags", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />

            <input
              type="number"
              placeholder="Min Spend"
              onChange={(e) => onFilterChange("minSpend", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />

            <input
              type="number"
              placeholder="Min Orders"
              onChange={(e) => onFilterChange("minOrders", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />

            <input
              type="date"
              onChange={(e) => onFilterChange("signupDate", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── User Profile Modal ────────────────────────────────────────────────────
function UserProfileModal({ user, onClose, onUpdate }) {
  const [userData, setUserData] = useState(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user?._id]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await API(`/api/orders?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    return status === "hot" ? "#10b981" : status === "cold" ? "#f59e0b" : "#ef4444";
  };

  const handleAction = (action) => {
    if (action === "block") {
      if (confirm("Are you sure you want to block this user?")) {
        // Call API to block user
        console.log("Block user:", user._id);
      }
    } else if (action === "tag") {
      const tag = prompt("Enter tag:");
      if (tag) {
        console.log("Tag user:", user._id, tag);
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        zIndex: 9999,
        animation: "slideIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: "600px",
          height: "100vh",
          overflowY: "auto",
          boxShadow: "-2px 0 12px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <h2 style={{ ...S, margin: 0, fontSize: "18px", fontWeight: "700" }}>
            User Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Profile Image & Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#e2e8f0",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ ...S, margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>
              {userData?.name}
            </h3>
            <p style={{ ...S, margin: "0 0 12px 0", fontSize: "13px", color: "#64748b" }}>
              ID: {userData?._id}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "12px" }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: `${getStatusColor(userData?.status)}22`,
                  color: getStatusColor(userData?.status),
                }}
              >
                {userData?.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button
                onClick={() => handleAction("tag")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add Tag
              </button>
              <button
                onClick={() => handleAction("block")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  background: "white",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Block
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                Total Orders
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
                {userData?.totalOrders || 0}
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                Last Purchase
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                {userData?.lastPurchase ? new Date(userData.lastPurchase).toLocaleDateString() : "Never"}
              </div>
            </div>
          </div>

          {/* Contact & Address */}
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ ...S, margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
              Contact Information
            </h4>
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Email</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {userData?.email}
                </div>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Phone</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {userData?.phone || "N/A"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Address</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {userData?.address || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h4 style={{ ...S, margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
              Order History
            </h4>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                Loading orders...
              </div>
            ) : orders.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                        Order ID
                      </th>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                        Date
                      </th>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                        Amount
                      </th>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order._id}
                        style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <td style={{ padding: "10px", color: "#0f172a", fontWeight: "600" }}>
                          {order._id?.slice(-8).toUpperCase()}
                        </td>
                        <td style={{ padding: "10px", color: "#475569" }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "10px", color: "#0f172a", fontWeight: "600" }}>
                          ₹{order.total}
                        </td>
                        <td style={{ padding: "10px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: "#e0f2fe",
                              color: "#0369a1",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                No orders found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Users Table with Pagination ───────────────────────────────────────────
function UsersTable({ users, selectedUsers, onSelectUser, onSelectAll, onViewUser, currentPage, totalPages, onPageChange }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={onSelectAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                USER ID
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                NAME
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                EMAIL
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                STATUS
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                LAST LOGIN
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                ORDERS
              </th>
              <th style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: "#475569", fontSize: "13px" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const statusColor =
                user.status === "hot" ? "#10b981" : user.status === "cold" ? "#f59e0b" : "#ef4444";

              return (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    background: selectedUsers.includes(user._id) ? "#f0f4ff" : "white",
                  }}
                  onMouseEnter={(e) => !selectedUsers.includes(user._id) && (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) =>
                    !selectedUsers.includes(user._id) && (e.currentTarget.style.background = "white")
                  }
                >
                  <td style={{ padding: "12px", textAlign: "left" }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => onSelectUser(user._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    {user._id?.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        background: `${statusColor}22`,
                        color: statusColor,
                      }}
                    >
                      {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    {user.totalOrders || 0}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => onViewUser(user)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6366f1",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px 8px",
                      }}
                      title="View details"
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontSize: "13px", color: "#64748b" }}>
          Page {currentPage} of {totalPages}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: currentPage === 1 ? "#f1f5f9" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: currentPage === 1 ? "#cbd5e1" : "#475569",
              fontWeight: "600",
            }}
          >
            <ChevronLeftIcon /> Prev
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: currentPage === totalPages ? "#f1f5f9" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: currentPage === totalPages ? "#cbd5e1" : "#475569",
              fontWeight: "600",
            }}
          >
            Next <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main User Management Component ─────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [kpiData, setKpiData] = useState({ total: 0, hot: 0, cold: 0, deactive: 0 });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    tags: "",
    minSpend: "",
    minOrders: "",
    signupDate: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/users?page=${currentPage}&limit=${itemsPerPage}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      if (filters.status) {
        url += `&status=${filters.status}`;
      }

      if (filters.minOrders) {
        url += `&minOrders=${filters.minOrders}`;
      }

      if (filters.signupDate) {
        url += `&signupDate=${filters.signupDate}`;
      }

      const response = await API(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(response.data || []);
      setTotalPages(response.totalPages || 1);

      // Calculate KPI data
      const total = response.total || 0;
      const hotCount = response.data?.filter((u) => u.status === "hot").length || 0;
      const coldCount = response.data?.filter((u) => u.status === "cold").length || 0;
      const deactiveCount = response.data?.filter((u) => u.status === "deactive").length || 0;

      setKpiData({ total, hot: hotCount, cold: coldCount, deactive: deactiveCount });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u._id));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    if (action === "delete") {
      if (confirm(`Delete ${selectedUsers.length} user(s)?`)) {
        console.log("Deleting users:", selectedUsers);
        setSelectedUsers([]);
        fetchUsers();
      }
    } else if (action === "block") {
      if (confirm(`Block ${selectedUsers.length} user(s)?`)) {
        console.log("Blocking users:", selectedUsers);
        setSelectedUsers([]);
        fetchUsers();
      }
    } else if (action === "tag") {
      const tag = prompt("Enter tag for selected users:");
      if (tag) {
        console.log("Tagging users:", selectedUsers, "with tag:", tag);
        setSelectedUsers([]);
      }
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f1f5f9", minHeight: "100vh", ...S }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ ...S, margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
            User Management
          </h1>
          <p style={{ ...S, margin: 0, fontSize: "14px", color: "#64748b" }}>
            Centralized interface to monitor, filter, and manage all customers
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <KPICard label="Total Users" value={kpiData.total} color="#6366f1" />
          <KPICard label="Hot Users" value={kpiData.hot} color="#10b981" />
          <KPICard label="Cold Users" value={kpiData.cold} color="#f59e0b" />
          <KPICard label="Deactive Users" value={kpiData.deactive} color="#ef4444" />
        </div>

        {/* Search & Filter */}
        <SearchFilterBar
          onSearch={setSearchTerm}
          onFilterChange={handleFilterChange}
          filters={filters}
        />

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div
            style={{
              background: "white",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
              {selectedUsers.length} user(s) selected
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleBulkAction("tag")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add Tag
              </button>
              <button
                onClick={() => handleBulkAction("block")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Block
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  background: "white",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading users...
          </div>
        ) : (
          <UsersTable
            users={users}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onViewUser={setSelectedUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* User Profile Modal */}
        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdate={() => fetchUsers()}
          />
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
