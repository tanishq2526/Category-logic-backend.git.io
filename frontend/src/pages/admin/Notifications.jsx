/*
 * Notifications.jsx
 * Admin notifications page displaying latest system alerts.
 */
import React, { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, User, Settings, CheckCheck, Circle } from "lucide-react";
import "./Notifications.css";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "new_order",
    title: "New Order Received",
    subtitle: "Order #ORD-8293 from John Doe for ₹12,400.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
  },
  {
    id: "notif-2",
    type: "payment",
    title: "Payment Successful",
    subtitle: "Payment of ₹12,400 received via Razorpay.",
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    isRead: false,
  },
  {
    id: "notif-3",
    type: "signup",
    title: "New User Registered",
    subtitle: "Jane Smith (jane.smith@example.com) created an account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
  },
  {
    id: "notif-4",
    type: "shipped",
    title: "Order Shipped",
    subtitle: "Order #ORD-7102 has been shipped via BlueDart.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
  },
  {
    id: "notif-5",
    type: "system",
    title: "System Maintenance Scheduled",
    subtitle: "Database maintenance scheduled for 2 AM tonight.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
  },
];

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getIconConfig = (type) => {
  switch (type) {
    case "new_order":
    case "shipped":
      return { icon: ShoppingCart, bg: "#fff7ed", color: "#ea580c" }; // Orange
    case "payment":
      return { icon: CreditCard, bg: "#f0fdfa", color: "#0d9488" }; // Teal
    case "signup":
      return { icon: User, bg: "#eff6ff", color: "#2563eb" }; // Blue
    case "system":
      return { icon: Settings, bg: "#fefce8", color: "#ca8a04" }; // Yellow
    default:
      return { icon: Circle, bg: "#f1f5f9", color: "#64748b" }; // Gray
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Simulating API fetch
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "Read") return n.isRead;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="notif-page">
      {/* Header */}
      <div className="notif-header">
        <div>
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">
            Stay up to date with your latest alerts and messages.
          </p>
        </div>
        <button className="notif-mark-all-btn" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      {/* Card Container */}
      <div className="notif-card">
        {/* Card Header & Tabs */}
        <div className="notif-card-header">
          <div className="notif-card-title">
            All Notifications
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </div>
          <div className="notif-tabs">
            {["All", "Unread", "Read"].map((tab) => (
              <button
                key={tab}
                className={`notif-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty">No {filter.toLowerCase()} notifications found.</div>
          ) : (
            filteredNotifications.map((notif) => {
              const { icon: Icon, bg, color } = getIconConfig(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.isRead ? "unread" : ""}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div
                    className="notif-icon-box"
                    style={{ backgroundColor: bg, color: color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-item-title">
                      {notif.title}
                      {!notif.isRead && <span className="notif-unread-dot" />}
                    </div>
                    <div className="notif-item-subtitle">{notif.subtitle}</div>
                    <div className="notif-item-time">{timeAgo(notif.timestamp)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
