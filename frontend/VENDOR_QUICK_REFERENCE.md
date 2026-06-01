# Vendor Panel - Quick Reference Guide

## 🚀 Quick Start

### Import CSS
```javascript
import "../../styles/vendor.css";
```

### Basic Page Structure
```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "lucide-react";
import API from "../../utils/api";
import "../../styles/vendor.css";

function MyVendorPage() {
  const { vendorSlug } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [vendorSlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API(`/api/vendor/${vendorSlug}/endpoint`);
      setData(Array.isArray(response) ? response : response?.data || []);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-page">
      {/* Header */}
      <div className="vendor-header">
        <div className="vendor-header-content">
          <div className="subtitle">📌 Section</div>
          <h1>Page Title</h1>
          <p className="description">Brief description</p>
        </div>
        <div className="vendor-header-actions">
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <div className="skeleton" />}
      {error && (
        <div className="card" style={{ background: "rgba(248, 113, 113, 0.1)" }}>
          <span style={{ color: "#f87171" }}>{error}</span>
        </div>
      )}
      {!loading && !error && <div>Your content here</div>}
    </div>
  );
}

export default MyVendorPage;
```

---

## 🎨 Common Patterns

### Stat Cards
```jsx
<div className="stat-grid">
  <div className="stat-card">
    <div className="stat-icon primary">
      <Package size={20} />
    </div>
    <div className="stat-value">123</div>
    <div className="stat-label">Total Items</div>
  </div>
</div>
```

### Buttons
```jsx
<!-- Primary -->
<button className="btn btn-primary"><Plus size={16} /> Add Item</button>

<!-- Secondary -->
<button className="btn btn-secondary">Cancel</button>

<!-- Danger -->
<button className="btn btn-danger"><Trash2 size={16} /> Delete</button>

<!-- Success -->
<button className="btn btn-success"><Check size={16} /> Confirm</button>

<!-- Small -->
<button className="btn btn-sm btn-secondary">Edit</button>

<!-- Icon Only -->
<button className="btn btn-icon btn-secondary"><Edit2 size={16} /></button>
```

### Badges
```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Cancelled</span>
<span className="badge badge-info">Info</span>
<span className="badge badge-secondary">Inactive</span>
```

### Cards
```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title"><Icon size={20} /> Title</h3>
  </div>
  <div className="card-content">
    {/* Content */}
  </div>
</div>
```

### Tables
```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="orders-row">
        <td>Data 1</td>
        <td>Data 2</td>
        <td>
          <button className="btn btn-icon btn-secondary"><Edit2 size={14} /></button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Forms
```jsx
<div className="form-group">
  <label>Field Name <span className="required">*</span></label>
  <input type="text" placeholder="Enter value" />
</div>

<div className="form-row">
  <div className="form-group">
    <label>Field 1</label>
    <input type="text" />
  </div>
  <div className="form-group">
    <label>Field 2</label>
    <input type="text" />
  </div>
</div>

<div className="form-actions">
  <button className="btn btn-secondary">Cancel</button>
  <button className="btn btn-primary">Save</button>
</div>
```

### Item Lists
```jsx
<div className="item-list">
  <div className="item">
    <div className="item-content">
      <div className="item-icon">
        <Icon size={20} />
      </div>
      <div className="item-text">
        <h3>Title</h3>
        <p>Description</p>
      </div>
    </div>
    <div className="item-actions">
      <button className="btn btn-icon btn-secondary"><Edit2 size={14} /></button>
      <button className="btn btn-icon btn-danger"><Trash2 size={14} /></button>
    </div>
  </div>
</div>
```

### Empty States
```jsx
<div className="empty-state">
  <div className="empty-state-icon">
    <Icon size={32} />
  </div>
  <h3 className="empty-state-title">No items found</h3>
  <p className="empty-state-description">Create your first item to get started</p>
  <button className="btn btn-primary">
    <Plus size={16} />
    Create Item
  </button>
</div>
```

### Loading Skeletons
```jsx
<div className="skeleton skeleton-title" />
<div className="skeleton skeleton-text" />
<div className="skeleton skeleton-card" />

<!-- In a loop -->
{[...Array(4)].map((_, i) => (
  <div key={i} className="card">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
  </div>
))}
```

---

## 🎯 Utility Classes

### Spacing
```jsx
<div className="p-lg mb-xl gap-md">Content</div>
```

### Typography
```jsx
<h1 className="text-lg font-700 text-primary">Title</h1>
<p className="text-sm text-muted">Muted text</p>
```

### Layout
```jsx
<div className="flex-between gap-lg">
  <span>Left</span>
  <span>Right</span>
</div>

<div className="grid-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 🎨 Color Variables

```css
--primary-bg: #0f172a;
--secondary-bg: #111827;
--text-primary: #f1f5f9;
--text-secondary: #cbd5e1;
--text-tertiary: #94a3b8;
--text-muted: #475569;
--success: #34d399;
--warning: #fbbf24;
--error: #f87171;
--info: #60a5fa;
--purple: #a78bfa;
```

---

## 📱 Responsive Design

### Grid System
```css
.grid-auto  /* auto-fit, minmax(250px, 1fr) */
.grid-2     /* 2 columns */
.grid-3     /* 3 columns */

/* Mobile: All become 1 column */
/* Tablet: 3-column becomes 2-column */
/* Desktop: No changes */
```

### Mobile First
```jsx
// All components are mobile-responsive by default
<div className="grid-auto">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 🔄 Data Fetching Pattern

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await API(`${BASE}/api/vendor/${vendorSlug}/endpoint`);
    const list = Array.isArray(data) ? data : data?.data || [];
    setData(list);
  } catch (err) {
    setError("Failed to load data");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

## ✅ Status Colors

```javascript
const STATUS_CONFIG = {
  pending: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  processing: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa" },
  shipped: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa" },
  delivered: { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
  cancelled: { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
};

const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || DEFAULT;
```

---

## 🎬 Animations

```css
/* Available animations */
@keyframes shimmer    /* Loading skeleton */
@keyframes fadeIn     /* Fade in effect */
@keyframes fadeUp     /* Fade from bottom */
@keyframes slideIn    /* Slide from left */
@keyframes spin       /* Rotation */
@keyframes pulse      /* Pulsing opacity */
```

---

## 🔍 Search Implementation

```jsx
const [searchTerm, setSearchTerm] = useState("");

const filteredItems = items.filter((item) =>
  item.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

<input
  type="text"
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

---

## 🏷️ Filter Implementation

```jsx
const [filter, setFilter] = useState("all");

const filteredItems = items.filter((item) => {
  if (filter === "all") return true;
  return item.status === filter;
});

<div>
  {["all", "active", "inactive"].map((btn) => (
    <button
      key={btn}
      className={filter === btn ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
      onClick={() => setFilter(btn)}
    >
      {btn.charAt(0).toUpperCase() + btn.slice(1)}
    </button>
  ))}
</div>
```

---

## 🚨 Error Handling

```jsx
{error && (
  <div className="card" style={{ background: "rgba(248, 113, 113, 0.1)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#f87171" }}>
      <AlertCircle size={20} />
      <span>{error}</span>
    </div>
  </div>
)}
```

---

## ✅ Success Handling

```jsx
{success && (
  <div className="card" style={{ background: "rgba(52, 211, 153, 0.1)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#34d399" }}>
      <CheckCircle size={20} />
      <span>{success}</span>
    </div>
  </div>
)}
```

---

## 📋 Checklists for New Pages

- [ ] Import `vendor.css`
- [ ] Use `vendor-page` container class
- [ ] Add `vendor-header` section
- [ ] Include stat cards if applicable
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Use `btn` classes for buttons
- [ ] Use `badge` classes for statuses
- [ ] Implement search/filter if needed
- [ ] Test responsiveness
- [ ] Add empty states
- [ ] Verify accessibility
- [ ] Check contrast ratios
- [ ] Test on mobile

---

## 🐛 Debugging Tips

### Check CSS Classes
- Open DevTools (F12)
- Inspect element
- Check if classes are applied
- Verify CSS is imported

### Check API Response
```javascript
console.log("API Response:", data);
console.log("Array check:", Array.isArray(data));
console.log("List:", list);
```

### Check Data Rendering
```javascript
console.log("Items:", items);
console.log("Filtered:", filteredItems);
console.log("Loading:", loading);
```

### Performance Issues
- Check for re-renders using React DevTools
- Lazy load images
- Implement pagination for long lists
- Cache API responses

---

## 📚 Resources

- **Icons**: lucide-react docs
- **Colors**: Color palette defined in vendor.css
- **Fonts**: DM Sans from Google Fonts
- **Spacing**: CSS variables (--spacing-*)
- **Animations**: @keyframes in vendor.css

---

## 🎯 Best Practices

1. **Always use utility classes** instead of inline styles
2. **Keep components simple** and focused
3. **Handle loading and error states**
4. **Test on mobile and desktop**
5. **Use semantic HTML** and proper structure
6. **Maintain consistent spacing** using CSS variables
7. **Use proper icon sizes** (16, 20, 24, 32)
8. **Show feedback** for user actions
9. **Validate form inputs** before submission
10. **Optimize images** for performance

---

**Last Updated**: May 29, 2026
**Version**: 1.0.0
