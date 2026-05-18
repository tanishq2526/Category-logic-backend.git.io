import { useEffect, useMemo, useState } from "react";

const API = {
  variants: "/api/variant/all",
  create: "/api/variant/create",
  update: (id) => `/api/variant/update/${id}`,
  delete: (id) => `/api/variant/delete/${id}`,
  products: "/api/product/all",
};

const initialForm = {
  parentProduct: "",
  name: "",
  brand: "",
  price: "",
  discountPercent: "",
  status: "Active",
  imageFile: null,
  imagePreview: null,
};

const formatNumber = (value) => {
  if (value == null || value === "") return "0";
  const number = Number(value);
  if (Number.isNaN(number)) return "0";
  const formatted = number.toFixed(2);
  if (formatted.endsWith(".00")) {
    return String(Math.trunc(number));
  }
  if (formatted.endsWith("0")) {
    return String(Number(number.toFixed(1)));
  }
  return formatted;
};

export default function VariantProducts() {
  const [variants, setVariants] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const variantsRes = await fetch(API.variants, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const variantsData = await variantsRes.json();
        setVariants(variantsData.data || []);
      } catch (error) {
        console.error("Unable to load variant page data", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  async function fetchVariants() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const query = [];
      if (filterStatus && filterStatus !== "all") query.push(`status=${encodeURIComponent(filterStatus)}`);
      if (filterProduct && filterProduct !== "all") query.push(`product=${encodeURIComponent(filterProduct)}`);
      const q = query.length ? `?${query.join("&")}` : "";
      const res = await fetch(`${API.variants}${q}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setVariants(data.data || []);
    } catch (error) {
      console.error("Unable to load variant products", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProductOptions(query = "") {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      params.append("limit", "5");
      const res = await fetch(`${API.products}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setProductOptions(data.data || []);
    } catch (error) {
      console.error("Unable to load base products", error);
      setProductOptions([]);
    }
  }

  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      fetchProductOptions(productQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [showModal, productQuery]);

  function openCreateModal() {
    setEditingVariant(null);
    setForm(initialForm);
    setProductQuery("");
    setShowModal(true);
  }

  function openEditModal(variant) {
    setEditingVariant(variant);
    setForm({
      parentProduct: variant.parentProduct?._id || "",
      name: variant.name || "",
      brand: variant.brand || "",
      price: variant.price || "",
      discountPercent: variant.discountPercent || "",
      status: variant.status || "Active",
      imageFile: null,
      imagePreview: variant.image ? `http://localhost:3000${variant.image}` : null,
    });
    setProductQuery(variant.parentProduct?.name || "");
    setShowModal(true);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.parentProduct) {
      return alert("Please choose a parent product for this variant.");
    }
    if (!form.name.trim()) {
      return alert("Variant name is required.");
    }
    if (!form.brand.trim()) {
      return alert("Brand is required.");
    }
    if (!form.price) {
      return alert("Price is required.");
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const payload = new FormData();
      payload.append("parentProduct", form.parentProduct);
      payload.append("name", form.name.trim());
      payload.append("brand", form.brand.trim());
      payload.append("price", form.price);
      payload.append("discountPercent", form.discountPercent);
      payload.append("status", form.status);
      if (form.imageFile) payload.append("image", form.imageFile);

      const url = editingVariant ? API.update(editingVariant._id) : API.create;
      const method = editingVariant ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Unable to save variant");
      }

      setShowModal(false);
      fetchVariants();
    } catch (error) {
      console.error(error);
      alert(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this variant product permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API.delete(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchVariants();
    } catch (error) {
      console.error(error);
      alert(error.message || "Delete failed");
    }
  }

  const filteredVariants = useMemo(() => {
    return variants.filter((variant) => {
      const text = search.trim().toLowerCase();
      if (text) {
        const productName = variant.parentProduct?.name?.toLowerCase() || "";
        const variantName = variant.name?.toLowerCase() || "";
        const brand = variant.brand?.toLowerCase() || "";
        if (!productName.includes(text) && !variantName.includes(text) && !brand.includes(text)) {
          return false;
        }
      }
      return true;
    });
  }, [variants, search]);

  const stats = {
    total: variants.length,
    active: variants.filter((item) => item.status === "Active").length,
    inactive: variants.filter((item) => item.status === "Inactive").length,
  };

  const parentProductOptions = productOptions.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const filterProductOptions = useMemo(() => {
    const map = {};
    variants.forEach((variant) => {
      const product = variant.parentProduct;
      if (product && !map[product._id]) {
        map[product._id] = product.name;
      }
    });
    return Object.entries(map).map(([value, label]) => ({ value, label }));
  }, [variants]);

  const visibleVariants = filteredVariants.filter((variant) => {
    if (filterStatus !== "all" && variant.status !== filterStatus) return false;
    if (filterProduct !== "all" && variant.parentProduct?._id !== filterProduct) return false;
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Variant Products</h1>
          <p style={styles.subheading}>
            Manage variant products linked to base products, with search, filters and quick actions.
          </p>
        </div>
        <button style={styles.button} onClick={openCreateModal}>
          + Create New Variant
        </button>
      </div>

      <div style={styles.statRow}>
        <StatCard label="Total Variants" value={stats.total} color="#6366f1" />
        <StatCard label="Active" value={stats.active} color="#10b981" />
        <StatCard label="Inactive" value={stats.inactive} color="#ef4444" />
      </div>

      <div style={styles.filterRow}>
        <div style={styles.searchWrap}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variant or base product..."
            style={styles.searchInput}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Base Products</option>
          {filterProductOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Variant</th>
              <th style={styles.th}>Base Product</th>
              <th style={styles.th}>Brand</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Discount</th>
              <th style={styles.th}>Final Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={styles.loadingCell}>
                  Loading variant products...
                </td>
              </tr>
            ) : visibleVariants.length === 0 ? (
              <tr>
                <td colSpan="9" style={styles.emptyCell}>
                  No variant products found.
                </td>
              </tr>
            ) : (
              visibleVariants.map((variant) => {
                const finalPrice = variant.discountPercent
                  ? Number(variant.price) -
                    (Number(variant.price) * Number(variant.discountPercent)) / 100
                  : Number(variant.price);
                return (
                  <tr key={variant._id}>
                    <td style={styles.td}>
                      {variant.image ? (
                        <img
                          src={`http://localhost:3000${variant.image}`}
                          alt={variant.name}
                          style={styles.thumb}
                        />
                      ) : (
                        <div style={styles.noImage}>No image</div>
                      )}
                    </td>
                    <td style={styles.td}>{variant.name}</td>
                    <td style={styles.td}>{variant.parentProduct?.name || "—"}</td>
                    <td style={styles.td}>{variant.brand}</td>
                    <td style={styles.td}>₹{formatNumber(variant.price)}</td>
                    <td style={styles.td}>
                      {variant.discountPercent ? `${formatNumber(variant.discountPercent)}%` : "—"}
                    </td>
                    <td style={styles.td}>₹{formatNumber(finalPrice)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background:
                            variant.status === "Active"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            variant.status === "Active"
                              ? "#166534"
                              : "#991b1b",
                        }}
                      >
                        {variant.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <button
                          style={styles.editButton}
                          onClick={() => openEditModal(variant)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDelete(variant._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingVariant ? "Update Variant" : "Create Variant"}
                </h2>
                <p style={styles.modalSubtitle}>
                  Link a new variant to an existing product and save the complete details.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={styles.label}>Search Base Product</label>
                  <input
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Search base product"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Parent Product</label>
                  <select
                    value={form.parentProduct}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, parentProduct: e.target.value }))
                    }
                    style={styles.input}
                  >
                    <option value="">Select base product</option>
                    {parentProductOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {productOptions.length === 0 && (
                    <p style={styles.smallNote}>No base products found for this search.</p>
                  )}
                </div>

                <div>
                  <label style={styles.label}>Variant Name</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    style={styles.input}
                    placeholder="Example: Red XL"
                  />
                </div>

                <div>
                  <label style={styles.label}>Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, brand: e.target.value }))
                    }
                    style={styles.input}
                    placeholder="Example: Nike"
                  />
                </div>

                <div>
                  <label style={styles.label}>Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    style={styles.input}
                    placeholder="₹0"
                  />
                </div>

                <div>
                  <label style={styles.label}>Discount %</label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, discountPercent: e.target.value }))
                    }
                    style={styles.input}
                    placeholder="10"
                  />
                </div>

                <div>
                  <label style={styles.label}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    style={styles.input}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={styles.label}>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.input}
                  />
                </div>

                {form.imagePreview && (
                  <div style={{ gridColumn: "span 2" }}>
                    <p style={{ marginBottom: "8px", fontWeight: 600 }}>Preview</p>
                    <img
                      src={form.imagePreview}
                      alt="Variant preview"
                      style={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={styles.saveButton}>
                  {saving ? "Saving..." : editingVariant ? "Update Variant" : "Create Variant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderColor: `${color}22` }}>
      <p style={styles.statLabel}>{label}</p>
      <p style={{ ...styles.statValue, color }}>{value}</p>
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "'Outfit', sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subheading: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "14px",
  },
  button: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
  statRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  statCard: {
    flex: "1 1 220px",
    background: "white",
    borderRadius: "16px",
    padding: "18px 22px",
    border: "1px solid",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
  },
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    margin: "10px 0 0",
    fontSize: "28px",
    fontWeight: "700",
  },
  filterRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  searchWrap: {
    flex: "1 1 320px",
    minWidth: "220px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
  },
  select: {
    minWidth: "180px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "white",
    outline: "none",
    fontSize: "14px",
  },
  tableWrapper: {
    background: "white",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#f8fafc",
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#0f172a",
    verticalAlign: "middle",
  },
  loadingCell: {
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },
  thumb: {
    width: "52px",
    height: "52px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  noImage: {
    width: "52px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "12px",
  },
  statusBadge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  editButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#3730a3",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: "720px",
    borderRadius: "20px",
    background: "white",
    padding: "28px",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.16)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "22px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },
  modalSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    lineHeight: 1,
    color: "#475569",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    background: "white",
    boxSizing: "border-box",
  },
  previewImage: {
    width: "100%",
    maxHeight: "260px",
    objectFit: "cover",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "26px",
    flexWrap: "wrap",
  },
  cancelButton: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#475569",
    cursor: "pointer",
    fontWeight: "600",
  },
  saveButton: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};
