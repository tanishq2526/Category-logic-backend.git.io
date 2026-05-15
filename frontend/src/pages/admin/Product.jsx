import { useState, useEffect, useCallback } from "react";
import "./Product.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg
    width="15"
    height="15"
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
    width="15"
    height="15"
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

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const calcFinalPrice = (price, pct) =>
  pct ? Math.round(price - (price * pct) / 100) : price;

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductModal({
  mode,
  product,
  categories,
  allSubcategories,
  onClose,
  onSaved,
}) {
  const isEdit = mode === "edit";

  const [selectedParent, setSelectedParent] = useState(
    isEdit ? product?.subCategory?.parentCategory?._id || "" : "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    isEdit ? product?.subCategory?._id || "" : "",
  );
  const [name, setName] = useState(isEdit ? product?.name || "" : "");
  const [brand, setBrand] = useState(isEdit ? product?.brand || "" : "");
  const [price, setPrice] = useState(isEdit ? product?.price || "" : "");
  const [discountPercent, setDiscountPercent] = useState(
    isEdit ? product?.discountPercent || "" : "",
  );
  const [status, setStatus] = useState(
    isEdit ? product?.status || "Active" : "Active",
  );
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    isEdit && product?.image ? `http://localhost:3000${product.image}` : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subcategories = allSubcategories.filter(
    (s) => !selectedParent || s.parentCategory?._id === selectedParent,
  );

  const parentCat = categories.find((c) => c._id === selectedParent);
  const parentInactive = parentCat?.status === "Inactive";

  useEffect(() => {
    if (parentInactive) setStatus("Inactive");
  }, [parentInactive]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setError("Please select a sub-category.");
      return;
    }
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!price) {
      setError("Price is required.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("subCategory", selectedCategory);
    formData.append("name", name.trim());
    formData.append("brand", brand.trim());
    formData.append("price", price);
    formData.append("discountPercent", discountPercent);
    formData.append("status", status);
    if (imageFile) formData.append("image", imageFile);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        isEdit ? `/api/product/update/${product._id}` : "/api/product/create",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else setError(data.message || "Something went wrong.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="pm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pm-modal">
        <div className="pm-modal-header">
          <span className="pm-modal-title">
            {isEdit ? "Edit Product" : "New Product"}
          </span>
          <button className="btn-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="pm-modal-body">
          <div className="pm-field">
            <label>Product Image</label>
            <label className="pm-img-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="pm-img-preview"
                />
              ) : (
                <>
                  <ImagePlaceholderIcon />
                  <p className="pm-img-upload-text">Click to upload an image</p>
                </>
              )}
            </label>
          </div>

          <div className="pm-field">
            <label>Parent Category</label>
            <select
              value={selectedParent}
              onChange={(e) => {
                setSelectedParent(e.target.value);
                setSelectedCategory("");
              }}
            >
              <option value="">— Select Parent Category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                  {c.status === "Inactive" ? " (Inactive)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="pm-field">
            <label>Sub Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={!selectedParent}
            >
              <option value="">— Select Sub Category —</option>
              {subcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {parentInactive && (
            <p className="pm-note">
              ⚠ The selected parent category is Inactive — this product will
              also be set to Inactive.
            </p>
          )}

          <div className="pm-row">
            <div className="pm-field">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Running Shoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="pm-field">
              <label>Brand</label>
              <input
                type="text"
                placeholder="e.g. Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="pm-row">
            <div className="pm-field">
              <label>Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="pm-field">
              <label>Discount %</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
          </div>

          <div className="pm-field">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={parentInactive}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {error && <p className="pm-error">{error}</p>}
        </div>

        <div className="pm-modal-footer">
          <button
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-modal-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function ConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div
      className="pm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pm-modal pm-modal-sm">
        <div className="pm-modal-header">
          <span className="pm-modal-title">Delete Product</span>
          <button className="btn-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="pm-modal-body">
          <p className="pm-confirm-text">
            Are you sure you want to delete <strong>{product.name}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="pm-modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-modal-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    const headers = getHeaders();
    const [catRes, subRes, prodRes] = await Promise.all([
      fetch("/api/category/all", { headers }),
      fetch("/api/subCategory/all", { headers }),
      fetch("/api/product/all", { headers }),
    ]);
    const [catData, subData, prodData] = await Promise.all([
      catRes.json(),
      subRes.json(),
      prodRes.json(),
    ]);
    setCategories(catData.data || []);
    setAllSubcategories(subData.data || []);
    setProducts(prodData.data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const inactiveCategoryIds = new Set(
    categories.filter((c) => c.status === "Inactive").map((c) => c._id),
  );

  const effectiveStatus = (product) => {
    const parentId = product.subCategory?.parentCategory?._id;
    if (parentId && inactiveCategoryIds.has(parentId)) return "Inactive";
    return product.status;
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.subCategory?.name?.toLowerCase().includes(q) ||
      p.subCategory?.parentCategory?.name?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || effectiveStatus(p) === filterStatus;
    const matchCategory =
      !filterCategory || p.subCategory?.parentCategory?._id === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const rawPages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    )
      rawPages.push(i);
  }
  const pageItems = [];
  rawPages.forEach((n, idx) => {
    if (idx > 0 && n - rawPages[idx - 1] > 1) pageItems.push("...");
    pageItems.push(n);
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/product/delete/${deleteTarget._id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.success) {
      load();
      setDeleteTarget(null);
    }
  };

  return (
    <div className="container">
      <div className="pm-header">
        <h1>Manage Products</h1>
        <button
          className="btn-new-product"
          onClick={() => setModal({ mode: "create" })}
        >
          <PlusIcon /> New Product
        </button>
      </div>

      <div className="pm-toolbar">
        <div className="pm-search-wrap">
          <SearchIcon />
          <input
            className="pm-search"
            placeholder="Search by name, brand, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="pm-empty">
                    <ImagePlaceholderIcon />
                    <p>No products found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((product) => {
                const effStatus = effectiveStatus(product);
                const finalPrice = calcFinalPrice(
                  product.price,
                  product.discountPercent,
                );
                return (
                  <tr key={product._id}>
                    <td>
                      {product.image ? (
                        <img
                          src={`http://localhost:3000${product.image}`}
                          alt={product.name}
                          className="pm-thumb"
                        />
                      ) : (
                        <div className="pm-no-img">
                          <ImagePlaceholderIcon />
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.brand || "—"}</td>
                    <td>{product.subCategory?.parentCategory?.name || "—"}</td>
                    <td>{product.subCategory?.name || "—"}</td>
                    <td>
                      {product.discountPercent > 0 ? (
                        <span className="pm-price-orig">₹{product.price}</span>
                      ) : (
                        <span className="pm-price">₹{product.price}</span>
                      )}
                    </td>
                    <td>
                      {product.discountPercent > 0 ? (
                        <span className="pm-discount-badge">
                          -{product.discountPercent}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className="pm-price">₹{finalPrice}</span>
                    </td>
                    <td>
                      <span
                        className={`pm-badge ${effStatus === "Active" ? "pm-badge-active" : "pm-badge-inactive"}`}
                      >
                        {effStatus}
                      </span>
                    </td>
                    <td>
                      <div className="pm-action-cell">
                        <button
                          className="btn-icon-action btn-edit-icon"
                          title="Edit"
                          onClick={() => setModal({ mode: "edit", product })}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon-action btn-del-icon"
                          title="Delete"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <DeleteIcon />
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

      {totalPages > 1 && (
        <div className="pm-pagination">
          <span className="pm-page-info">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} products
          </span>
          <button
            className="pm-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </button>
          {pageItems.map((item, i) =>
            item === "..." ? (
              <span key={`ell-${i}`} className="pm-page-ellipsis">
                …
              </span>
            ) : (
              <button
                key={item}
                className={`pm-page-btn ${currentPage === item ? "pm-page-active" : ""}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ),
          )}
          <button
            className="pm-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}

      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          categories={categories}
          allSubcategories={allSubcategories}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default Product;
