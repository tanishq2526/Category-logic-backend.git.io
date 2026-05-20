import { useState, useMemo } from "react";
import "./GiftCards.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="18"
    height="18"
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
    width="18"
    height="18"
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

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const dummyGiftCards = [
  {
    id: 1,
    code: "GC-2024-001",
    expiryDate: "2025-12-31",
    userName: "John Doe",
    value: 500,
    description: "Welcome bonus gift card",
    status: "active",
    assignedTo: "John Doe",
    giftedBy: "Admin",
  },
  {
    id: 2,
    code: "GC-2024-002",
    expiryDate: "2024-06-30",
    userName: "Jane Smith",
    value: 1000,
    description: "Holiday special",
    status: "expired",
    assignedTo: "Jane Smith",
    giftedBy: "Manager",
  },
  {
    id: 3,
    code: "GC-2024-003",
    expiryDate: "2025-03-15",
    userName: "Mike Johnson",
    value: 750,
    description: "Referral reward",
    status: "active",
    assignedTo: "Mike Johnson",
    giftedBy: "Support Team",
  },
  {
    id: 4,
    code: "GC-2024-004",
    expiryDate: "2025-08-20",
    userName: "Sarah Williams",
    value: 2000,
    description: "VIP customer",
    status: "used",
    assignedTo: "Sarah Williams",
    giftedBy: "Admin",
  },
  {
    id: 5,
    code: "GC-2024-005",
    expiryDate: "2025-11-10",
    userName: "Robert Brown",
    value: 500,
    description: "Birthday gift",
    status: "active",
    assignedTo: "Robert Brown",
    giftedBy: "HR Team",
  },
  {
    id: 6,
    code: "GC-2024-006",
    expiryDate: "2024-07-15",
    userName: "Emily Davis",
    value: 1500,
    description: "Anniversary reward",
    status: "expired",
    assignedTo: "Emily Davis",
    giftedBy: "Admin",
  },
  {
    id: 7,
    code: "GC-2024-007",
    expiryDate: "2025-09-30",
    userName: "David Wilson",
    value: 300,
    description: "Loyalty points redemption",
    status: "active",
    assignedTo: "David Wilson",
    giftedBy: "Loyalty Team",
  },
  {
    id: 8,
    code: "GC-2024-008",
    expiryDate: "2025-02-28",
    userName: "Lisa Anderson",
    value: 800,
    description: "Promotional campaign",
    status: "used",
    assignedTo: "Lisa Anderson",
    giftedBy: "Marketing",
  },
];

// ─── Modal Component ───────────────────────────────────────────────────────────
const GiftCardModal = ({ isOpen, onClose, onSave, editingCard }) => {
  const [formData, setFormData] = useState(
    editingCard || {
      code: "",
      assignedTo: "",
      giftedBy: "",
      value: "",
      expiryDate: "",
      status: "active",
      description: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({
      code: "",
      assignedTo: "",
      giftedBy: "",
      value: "",
      expiryDate: "",
      status: "active",
      description: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="gc-modal-backdrop">
      <div className="gc-modal">
        {/* Header */}
        <div className="gc-modal-header">
          <h2>
            {editingCard ? "Edit Gift Card" : "Create New Gift Card"}
          </h2>
          <button
            onClick={onClose}
            className="gc-modal-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="gc-modal-body">
          {/* Assigned Person Name */}
          <div className="gc-modal-form-group">
            <label className="gc-form-label">
              Assigned Person Name *
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter assigned person name"
              className="gc-form-input"
            />
          </div>

          {/* Gifted By Person Name */}
          <div className="gc-modal-form-group">
            <label className="gc-form-label">
              Gifted By Person Name *
            </label>
            <input
              type="text"
              name="giftedBy"
              value={formData.giftedBy}
              onChange={handleChange}
              placeholder="Enter gifted by person name"
              className="gc-form-input"
            />
          </div>

          {/* Code and Value Row */}
          <div className="gc-form-grid-2">
            {/* Code */}
            <div className="gc-modal-form-group">
              <label className="gc-form-label">Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="GC-2024-001"
                className="gc-form-input"
              />
            </div>

            {/* Value / Discount */}
            <div className="gc-modal-form-group">
              <label className="gc-form-label">Value / Discount *</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="500"
                className="gc-form-input"
              />
            </div>
          </div>

          {/* Expiry Date and Status Row */}
          <div className="gc-form-grid-2">
            {/* Expiry Date */}
            <div className="gc-modal-form-group">
              <label className="gc-form-label">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="gc-form-input"
              />
            </div>

            {/* Status */}
            <div className="gc-modal-form-group">
              <label className="gc-form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="gc-form-select"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          {/* Description / Message */}
          <div className="gc-modal-form-group">
            <label className="gc-form-label">Description / Message</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter gift card description or message"
              className="gc-form-textarea"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="gc-modal-footer">
          <button
            onClick={onClose}
            className="gc-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="gc-btn-save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Gift Card Grid Card ───────────────────────────────────────────────────────
const GiftCardGridCard = ({ card, onEdit, onDelete }) => {
  const getStatusClassName = (status) => {
    switch (status) {
      case "active":
        return "gc-status-active";
      case "expired":
        return "gc-status-expired";
      case "used":
        return "gc-status-used";
      default:
        return "gc-status-active";
    }
  };

  return (
    <div className="gc-card">
      {/* Card Header with Code and Status */}
      <div className="gc-card-header">
        <div className="gc-card-code">
          <p className="gc-card-code-label">Code</p>
          <p className="gc-card-code-text">{card.code}</p>
        </div>
        <span className={`gc-status-badge ${getStatusClassName(card.status)}`}>
          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
        </span>
      </div>

      {/* Expiry Date */}
      <div className="gc-card-field">
        <p className="gc-card-field-label">Expiry Date</p>
        <p className="gc-card-field-value">{card.expiryDate}</p>
      </div>

      {/* User Name */}
      <div className="gc-card-field">
        <p className="gc-card-field-label">User Name</p>
        <p className="gc-card-field-value">{card.userName}</p>
      </div>

      {/* Gift Card Value */}
      <div className="gc-card-field">
        <p className="gc-card-field-label">Gift Card Value</p>
        <p className="gc-card-field-value gc-value">₹{card.value}</p>
      </div>

      {/* Description */}
      <div className="gc-card-field">
        <p className="gc-card-field-label">Description</p>
        <p className="gc-card-field-value gc-description">{card.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="gc-card-actions">
        <button
          onClick={() => onEdit(card)}
          className="gc-btn-action gc-btn-edit"
        >
          <EditIcon /> Edit
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="gc-btn-action gc-btn-delete"
        >
          <DeleteIcon /> Delete
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GiftCards() {
  const [giftCards, setGiftCards] = useState(dummyGiftCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and Search Logic
  const filteredCards = useMemo(() => {
    return giftCards.filter((card) => {
      const matchesSearch =
        card.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || card.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [giftCards, searchQuery, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSaveCard = (formData) => {
    if (editingCard) {
      setGiftCards((prev) =>
        prev.map((card) =>
          card.id === editingCard.id
            ? { ...card, ...formData, userName: formData.assignedTo }
            : card
        )
      );
    } else {
      const newCard = {
        id: Math.max(...giftCards.map((c) => c.id), 0) + 1,
        ...formData,
        userName: formData.assignedTo,
      };
      setGiftCards((prev) => [newCard, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCard = (id) => {
    if (window.confirm("Are you sure you want to delete this gift card?")) {
      setGiftCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Page Header */}
      <div className="gc-header">
        <h1>Gift Cards</h1>
        <p>Manage and create gift cards for your customers</p>
      </div>

      {/* Controls Section */}
      <div className="gc-controls">
        <div className="gc-controls-wrapper">
          {/* Search Bar */}
          <div className="gc-search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by user name or code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="gc-search"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="gc-filter-wrap">
            <FilterIcon />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="gc-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="used">Used</option>
            </select>
          </div>

          {/* Create New Button */}
          <button
            onClick={handleOpenModal}
            className="gc-btn-create"
          >
            <PlusIcon /> Create New
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="gc-results-info">
        Showing {paginatedCards.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
        {Math.min(currentPage * itemsPerPage, filteredCards.length)} of {filteredCards.length} gift
        cards
      </div>

      {/* Gift Cards Grid */}
      {paginatedCards.length > 0 ? (
        <div className="gc-grid">
          {paginatedCards.map((card) => (
            <GiftCardGridCard
              key={card.id}
              card={card}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          ))}
        </div>
      ) : (
        <div className="gc-empty-state">
          <p>No gift cards found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="gc-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="gc-pagination-btn"
          >
            <ChevronLeftIcon />
          </button>

          <div style={{ display: "flex", gap: "4px" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`gc-pagination-btn ${
                  currentPage === page ? "gc-active" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="gc-pagination-btn"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}

      {/* Modal */}
      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        editingCard={editingCard}
      />
    </div>
  );
}
