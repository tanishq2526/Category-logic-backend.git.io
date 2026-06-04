import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./Notifications.css";

const initialMessages = [
  {
    id: 1,
    name: "Ava Patel",
    role: "Operations Lead",
    message: "Changed issue #1042 status from In Progress to Review.",
    preview: "Please confirm the QA checklist before release.",
    time: "5m ago",
    unread: true,
    avatar: "AP",
    accent: "#4f46e5",
  },
  {
    id: 2,
    name: "Liam Chen",
    role: "Support Manager",
    message: "Mentioned you in a customer follow-up comment.",
    preview: "We need your approval on the priority escalation.",
    time: "18m ago",
    unread: true,
    avatar: "LC",
    accent: "#0ea5e9",
  },
  {
    id: 3,
    name: "Maya Rivera",
    role: "Team Member",
    message: "Joined the fulfillment operations team.",
    preview: "She will be coordinating inventory handoffs today.",
    time: "1h ago",
    unread: true,
    avatar: "MR",
    accent: "#10b981",
  },
  {
    id: 4,
    name: "New Order",
    role: "Commerce Hub",
    message: "Order #ORD-4821 has been placed successfully.",
    preview: "3 items, express shipping requested.",
    time: "1h ago",
    unread: true,
    avatar: "NO",
    accent: "#f59e0b",
  },
  {
    id: 5,
    name: "Stock Alert",
    role: "Inventory",
    message: "Low-stock warning for premium earbuds.",
    preview: "Only 4 units remaining in the main warehouse.",
    time: "2h ago",
    unread: true,
    avatar: "SA",
    accent: "#ef4444",
  },
  {
    id: 6,
    name: "Payment Confirmed",
    role: "Finance",
    message: "Payment received for subscription renewal.",
    preview: "Invoice #INV-9910 has been marked paid.",
    time: "2h ago",
    unread: false,
    avatar: "PC",
    accent: "#22c55e",
  },
];

const initialArchived = [
  {
    id: 101,
    name: "Weekly Report",
    role: "Analytics",
    message: "Generated the weekly sales summary report.",
    preview: "Revenue, refund rate, and campaign performance are ready.",
    time: "Yesterday",
    avatar: "WR",
    accent: "#6366f1",
  },
  {
    id: 102,
    name: "Coupon Expired",
    role: "Promotions",
    message: "Summer coupon bundle expired at midnight.",
    preview: "It has been moved to the historical archive.",
    time: "2 days ago",
    avatar: "CE",
    accent: "#f97316",
  },
  {
    id: 103,
    name: "Inventory Sync",
    role: "Operations",
    message: "Completed the nightly inventory sync.",
    preview: "13 locations updated successfully.",
    time: "3 days ago",
    avatar: "IS",
    accent: "#14b8a6",
  },
];

const workflowData = [
  {
    tag: "Trigger",
    title: "Trigger",
    accent: "#2563eb",
    summary: "Orders, stock alerts, mentions, and team activity create incoming notifications.",
    items: ["New order #ORD-4821 received", "Low-stock alert for earbuds", "Support mention from Liam Chen"],
  },
  {
    tag: "Review",
    title: "Review",
    accent: "#7c3aed",
    summary: "Priority items move to the review queue for quick admin follow-up.",
    items: ["Issue #1042 moved to Review", "Payment confirmation for invoice #INV-9910", "Coupon usage spike detected"],
  },
  {
    tag: "Archive",
    title: "Archive",
    accent: "#0f766e",
    summary: "Completed or historical records are stored here for reference.",
    items: ["Weekly report generated", "Expired summer coupon archived", "Inventory sync completed"],
  },
  {
    tag: "Insights",
    title: "Insights",
    accent: "#f59e0b",
    summary: "Snapshot status helps admins understand unread, archived, and live activity.",
    items: ["6 unread notifications currently active", "3 archived records available", "Mock data mode enabled for testing"],
  },
];

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2Z" />
    <path d="M19 17h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1" />
    <path d="M9 19a3 3 0 0 0 6 0" />
  </svg>
);

const ArchiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h18" />
    <path d="M8 7V4h8v3" />
    <path d="M5 7l1 12h12l1-12" />
  </svg>
);

function Notifications() {
  const [activeTab, setActiveTab] = useState("messages");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [archived, setArchived] = useState(initialArchived);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".notifications-menu-wrap")) setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const archiveAll = () => {
    if (messages.length === 0) return;
    setArchived((prev) => [...prev, ...messages]);
    setMessages([]);
    setMenuOpen(false);
    toast.success("All notifications archived");
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((item) => ({ ...item, unread: false })));
    setMenuOpen(false);
    toast.success("All notifications marked as read");
  };

  const handleDisableNotifications = () => {
    setMenuOpen(false);
    toast("Notifications disabled", { icon: "🔕" });
  };

  const handleReportIssue = () => {
    setMenuOpen(false);
    toast.success("Issue reported successfully");
  };

  const handleFeedback = () => {
    setMenuOpen(false);
    toast.success("Thank you for your feedback");
  };

  const handleViewAll = () => {
    setActiveTab("archived");
    toast.success("Showing all archived notifications");
  };

  return (
    <section className="notifications-page">
      <Toaster position="top-right" toastOptions={{ duration: 3200 }} />

      <div className="notifications-shell">
        <header className="notifications-header card-surface">
          <div>
            <p className="eyebrow">Admin Center</p>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">Track team updates, orders, payment alerts, and archive historical activity.</p>
          </div>

          <div className="notifications-menu-wrap">
            <button
              className="icon-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open notifications actions"
            >
              <MenuIcon />
            </button>

            {menuOpen && (
              <div className="notifications-dropdown" role="menu">
                <div className="dropdown-section">
                  <p className="dropdown-label">SETTINGS</p>
                  <button onClick={archiveAll} className="dropdown-item">Archive All</button>
                  <button onClick={markAllAsRead} className="dropdown-item">Mark All As Read</button>
                  <button onClick={handleDisableNotifications} className="dropdown-item">Disable Notifications</button>
                  <button onClick={() => setShowWhatsNew(true)} className="dropdown-item">What&apos;s New?</button>
                </div>
                <div className="dropdown-section">
                  <p className="dropdown-label">FEEDBACK</p>
                  <button onClick={handleReportIssue} className="dropdown-item">Report Issue</button>
                  <button onClick={handleFeedback} className="dropdown-item">Send Feedback</button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="notifications-top-grid">
          <article className="mini-card card-surface">
            <div className="mini-card-icon blue"><BellIcon /></div>
            <div>
              <p className="mini-card-label">Unread</p>
              <strong>{messages.filter((item) => item.unread).length}</strong>
            </div>
          </article>
          <article className="mini-card card-surface">
            <div className="mini-card-icon purple"><ArchiveIcon /></div>
            <div>
              <p className="mini-card-label">Archived</p>
              <strong>{archived.length}</strong>
            </div>
          </article>
          <article className="mini-card card-surface">
            <div className="mini-card-icon green">✓</div>
            <div>
              <p className="mini-card-label">Status</p>
              <strong>Live mock feed</strong>
            </div>
          </article>
        </div>

        <section className="flowchart-panel card-surface">
          <div>
            <p className="eyebrow">Flow Overview</p>
            <h2 className="flowchart-title">Notification Workflow</h2>
            <p className="notifications-subtitle">A static view of how alerts move from trigger to review to archive.</p>
          </div>
          <div className="flow-grid">
            {workflowData.map((step, index) => (
              <button
                key={step.tag}
                type="button"
                className="flow-step flow-step-btn"
                onClick={() => setSelectedWorkflow(step)}
              >
                <span className="flow-step-tag">0{index + 1}</span>
                <strong>{step.title}</strong>
                <p className="flow-step-summary">{step.summary}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="notifications-panel card-surface">
          <div className="tab-row">
            <button
              className={`tab-btn ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
            <button
              className={`tab-btn ${activeTab === "archived" ? "active" : ""}`}
              onClick={() => setActiveTab("archived")}
            >
              Archived
            </button>
          </div>

          {activeTab === "messages" ? (
            <div className="notification-list">
              {messages.length === 0 ? (
                <div className="empty-state">All current notifications have been archived.</div>
              ) : (
                messages.map((item) => (
                  <article key={item.id} className="notification-card">
                    <div className="notification-card-main">
                      <div className="notification-avatar" style={{ background: item.accent }}>
                        {item.avatar}
                      </div>
                      <div className="notification-copy">
                        <div className="notification-headline">
                          <strong>{item.name}</strong>
                          {item.unread && <span className="unread-dot" />}
                        </div>
                        <p className="notification-role">{item.role}</p>
                        <p className="notification-message">{item.message}</p>
                        {item.preview && <p className="notification-preview">{item.preview}</p>}
                      </div>
                    </div>
                    <span className="notification-time">{item.time}</span>
                  </article>
                ))
              )}

              <button className="view-all-btn" onClick={handleViewAll}>View All Notifications →</button>
            </div>
          ) : (
            <div className="notification-list archived-list">
              {archived.map((item) => (
                <article key={item.id} className="notification-card archived-card">
                  <div className="notification-card-main">
                    <div className="notification-avatar" style={{ background: item.accent }}>
                      {item.avatar}
                    </div>
                    <div className="notification-copy">
                      <div className="notification-headline">
                        <strong>{item.name}</strong>
                        <span className="archived-tag">Archived</span>
                      </div>
                      <p className="notification-role">{item.role}</p>
                      <p className="notification-message">{item.message}</p>
                      {item.preview && <p className="notification-preview">{item.preview}</p>}
                    </div>
                  </div>
                  <span className="notification-time">{item.time}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedWorkflow && (
        <div className="modal-backdrop" onClick={() => setSelectedWorkflow(null)}>
          <div className="modal-card modal-card-wide" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">Static Workflow View</p>
                <h2>{selectedWorkflow.title}</h2>
              </div>
              <button className="icon-button" onClick={() => setSelectedWorkflow(null)} aria-label="Close workflow details">✕</button>
            </div>
            <p className="workflow-detail-summary">{selectedWorkflow.summary}</p>
            <ul className="flow-step-list workflow-detail-list">
              {selectedWorkflow.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showWhatsNew && (
        <div className="modal-backdrop" onClick={() => setShowWhatsNew(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">What&apos;s New</p>
                <h2>Version 1.0.0</h2>
              </div>
              <button className="icon-button" onClick={() => setShowWhatsNew(false)} aria-label="Close modal">✕</button>
            </div>
            <ul className="modal-list">
              <li>Notifications module added</li>
              <li>Archive functionality added</li>
              <li>Improved admin experience</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default Notifications;
