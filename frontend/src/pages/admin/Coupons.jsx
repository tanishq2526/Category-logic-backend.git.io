import { useEffect, useMemo, useState } from "react";

const API = {
  coupons: "/api/coupon",
  create: "/api/coupon/create",
  update: (id) => `/api/coupon/update/${id}`,
  delete: (id) => `/api/coupons/delete/${id}`,
  products: "/api/product/all",
};

const EditIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const styles = {
  page: {
    padding: "24px",
    fontFamily: "'Outfit', sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  button: {
    background: "#6366f1",
    border: "none",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  tableWrapper: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#f8fafc",
    padding: "14px",
    textAlign: "left",
    fontSize: "13px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#0f172a",
    verticalAlign: "top",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "white",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "20px",
    padding: "28px",
    maxHeight: "90vh",
    overflowY: "auto",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#334155",
  },
};

const initialForm = {
  couponCode: "",
  discount: "",
  usages: "",
  expires: "",
  status: "active",
  type: "cart",
  selectedProducts: [],
};

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (showModal && form.type === "product") {
      fetchProducts();
    }
  }, [showModal, form.type, productSearch]);

  async function fetchCoupons() {
    try {
      setLoading(true);

     const res = await fetch(API.coupons, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
         "Content-Type": "application/json",
       },
     });
      const data = await res.json();

      setCoupons(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      setProductLoading(true);

      const query = new URLSearchParams({
        limit: 10,
        search: productSearch,
      });

      const res = await fetch(`${API.products}?${query}`);
      const data = await res.json();

      setProducts(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setProductLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCoupon(null);
    setForm(initialForm);
    setShowModal(true);
  }

  function openEditModal(coupon) {
    setEditingCoupon(coupon);

    setForm({
      couponCode: coupon.couponCode || "",
      discount: coupon.discount || "",
      usages: coupon.usages || "",
      expires: coupon.expires
        ? coupon.expires.slice(0, 10)
        : "",
      status: coupon.status || "active",
      type: coupon.type || "cart",
      selectedProducts: coupon.products || [],
    });

    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.couponCode.trim()) {
      alert("Coupon code is required");
      return;
    }

    if (!form.discount) {
      alert("Discount is required");
      return;
    }

    if (form.type === "product" && form.selectedProducts.length === 0) {
      alert("Select at least one product");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        couponCode: form.couponCode.trim().toUpperCase(),
        discount: Number(form.discount),
        usages: Number(form.usages),
        expires: form.expires,
        status: form.status,
        type: form.type,
        products:
          form.type === "product"
            ? form.selectedProducts
            : [],
      };

      const url = editingCoupon
        ? API.update(editingCoupon._id)
        : API.create;

      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Delete this coupon permanently?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(API.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("Failed to delete coupon");
    }
  }

  function toggleProduct(product) {
    const exists = form.selectedProducts.some(
      (p) => p._id === product._id
    );

    if (exists) {
      setForm((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(
          (p) => p._id !== product._id
        ),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, product],
      }));
    }
  }

  const activeCoupons = useMemo(() => {
    return coupons.filter((c) => c.status === "active");
  }, [coupons]);

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Coupons</h1>

          <p
            style={{
              marginTop: "6px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Manage coupon discounts and product offers.
          </p>
        </div>

        <button
          style={styles.button}
          onClick={openCreateModal}
        >
          + Create Coupon
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            minWidth: "180px",
          }}
        >
          <p style={{ margin: 0, color: "#64748b" }}>
            Total Coupons
          </p>
          <h2 style={{ margin: "8px 0 0" }}>
            {coupons.length}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            minWidth: "180px",
          }}
        >
          <p style={{ margin: 0, color: "#64748b" }}>
            Active Coupons
          </p>
          <h2 style={{ margin: "8px 0 0", color: "#16a34a" }}>
            {activeCoupons.length}
          </h2>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Coupon Code</th>
              <th style={styles.th}>Discount</th>
              <th style={styles.th}>Usages</th>
              <th style={styles.th}>Expires</th>
              <th style={styles.th}>Created At</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td style={styles.td}>
                    <strong>{coupon.couponCode}</strong>
                  </td>

                  <td style={styles.td}>
                    {coupon.discount}%
                  </td>

                  <td style={styles.td}>
                    {coupon.usages}
                  </td>

                  <td style={styles.td}>
                    {coupon.expires
                      ? new Date(coupon.expires).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={styles.td}>
                    {coupon.createdAt
                      ? new Date(coupon.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={styles.td}>
                    {coupon.type === "product"
                      ? "Product Applicable"
                      : "Cart Applicable"}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        background:
                          coupon.status === "active"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          coupon.status === "active"
                            ? "#166534"
                            : "#991b1b",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => openEditModal(coupon)}
                        style={{
                          width: "40px",
                          height: "40px",
                          padding: "0",
                          border: "none",
                          borderRadius: "10px",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>

                      <button
                        onClick={() => handleDelete(coupon._id)}
                        style={{
                          width: "40px",
                          height: "40px",
                          padding: "0",
                          border: "none",
                          borderRadius: "10px",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "#0f172a",
                }}
              >
                {editingCoupon
                  ? "Update Coupon"
                  : "Create Coupon"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>
                    Coupon Code
                  </label>

                  <input
                    style={styles.input}
                    value={form.couponCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        couponCode: e.target.value,
                      }))
                    }
                    placeholder="SAVE20"
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Discount (%)
                  </label>

                  <input
                    type="number"
                    style={styles.input}
                    value={form.discount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discount: e.target.value,
                      }))
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <label style={styles.label}>Usages</label>

                  <input
                    type="number"
                    style={styles.input}
                    value={form.usages}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        usages: e.target.value,
                      }))
                    }
                    placeholder="100"
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    style={styles.input}
                    value={form.expires}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        expires: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label style={styles.label}>Status</label>

                  <select
                    style={styles.select}
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>
                    Coupon Type
                  </label>

                  <select
                    style={styles.select}
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                        selectedProducts: [],
                      }))
                    }
                  >
                    <option value="cart">
                      Cart Applicable
                    </option>

                    <option value="product">
                      Product Applicable
                    </option>
                  </select>
                </div>
              </div>

              {form.type === "product" && (
                <div
                  style={{
                    marginTop: "24px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                      }}
                    >
                      Select Products
                    </h3>

                    <input
                      style={{
                        ...styles.input,
                        width: "260px",
                      }}
                      value={productSearch}
                      onChange={(e) =>
                        setProductSearch(e.target.value)
                      }
                      placeholder="Search product from database"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(220px,1fr))",
                      gap: "12px",
                    }}
                  >
                    {productLoading ? (
                      <p>Loading products...</p>
                    ) : products.length === 0 ? (
                      <p>No products found.</p>
                    ) : (
                      products.map((product) => {
                        const selected =
                          form.selectedProducts.some(
                            (p) => p._id === product._id
                          );

                        return (
                          <div
                            key={product._id}
                            onClick={() => toggleProduct(product)}
                            style={{
                              border: selected
                                ? "2px solid #6366f1"
                                : "1px solid #e2e8f0",
                              borderRadius: "12px",
                              padding: "14px",
                              cursor: "pointer",
                              background: selected
                                ? "#eef2ff"
                                : "white",
                              transition: "0.2s",
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "15px",
                                color: "#0f172a",
                              }}
                            >
                              {product.name}
                            </h4>

                            <p
                              style={{
                                marginTop: "8px",
                                marginBottom: 0,
                                fontSize: "13px",
                                color: "#64748b",
                              }}
                            >
                              ₹{product.price}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {form.selectedProducts.length > 0 && (
                    <div style={{ marginTop: "18px" }}>
                      <h4
                        style={{
                          marginBottom: "10px",
                          fontSize: "15px",
                        }}
                      >
                        Selected Products
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        {form.selectedProducts.map((product) => (
                          <div
                            key={product._id}
                            style={{
                              background: "#6366f1",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: "999px",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {product.name}

                            <span
                              onClick={() => toggleProduct(product)}
                              style={{
                                cursor: "pointer",
                                fontWeight: "700",
                              }}
                            >
                              ×
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {form.status === "inactive" && (
                <div
                  style={{
                    marginTop: "20px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    padding: "14px",
                    borderRadius: "12px",
                    color: "#991b1b",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Inactive coupons will not apply discounts
                  on cart or products.
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "28px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...styles.button,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingCoupon
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


