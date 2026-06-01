import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VendorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ANALISE");

  const tabs = [
    "ANALISE",
    "BUSINESS INFORMATION",
    "PRODUCTS",
    "CATEGORY",
    "SUB-CATEGORY",
    "COUPON",
    "ORDERS",
    "DETAILS",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f1f5f9",
      padding: "32px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#000",
    }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          background: "none", border: "none",
          fontSize: "14px", fontWeight: "600",
          cursor: "pointer", marginBottom: "20px",
          color: "#64748b", display: "flex", alignItems: "center", gap: "6px"
        }}
      >
        ← Back to Vendors
      </button>

      {/* Main Container */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        minHeight: "80vh"
      }}>
        
        {/* 1. TOP CONTAINER (Vendor Profile Section) */}
        <div style={{
          padding: "32px",
          display: "flex",
          gap: "32px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc"
        }}>
          {/* Left side: Profile Photo */}
          <div style={{
            width: "160px",
            height: "200px",
            border: "1.5px solid #cbd5e1",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            flexShrink: 0
          }}>
            <span style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#475569",
              textAlign: "center",
              lineHeight: "1.4"
            }}>
              PROFILE<br />PHOTO
            </span>
          </div>

          {/* Right side: Text fields */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            flex: 1
          }}>
            {[
              { label: "VENDOR NAME", value: "Sandeep" },
              { label: "FIRM NAME", value: "Sandeep Enterprises" },
              { label: "VENDOR ID", value: "#BBE4D781" },
              { label: "EMAIL", value: "testuser2@gmail.com" },
              { label: "PHONE NO.", value: "+91 9876543210" },
              { label: "JOIN DATE", value: "28 May 2026" }
            ].map((field, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                  {field.label}
                </span>
                <div style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: "24px",
                  padding: "12px 20px",
                  fontSize: "15px",
                  color: "#0f172a",
                  backgroundColor: "#fff"
                }}>
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. MIDDLE NAVIGATION BAR (Segmented Tab Bar) */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#fff"
        }}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "16px 8px",
                fontSize: "12px",
                fontWeight: activeTab === tab ? "700" : "600",
                color: activeTab === tab ? "#000" : "#64748b",
                backgroundColor: activeTab === tab ? "#f8fafc" : "#fff",
                border: "none",
                borderRight: index < tabs.length - 1 ? "1px solid #e2e8f0" : "none",
                borderBottom: activeTab === tab ? "2px solid #000" : "2px solid transparent",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.15s ease",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "56px"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. BOTTOM CONTAINER (Data Display Area) */}
        <div style={{
          flex: 1,
          padding: "32px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}>
          
          {activeTab === "ANALISE" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px", textTransform: "uppercase" }}>Total Revenue</h3>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>₹ 45,230</p>
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px", textTransform: "uppercase" }}>Total Orders</h3>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>124</p>
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px", textTransform: "uppercase" }}>Average Rating</h3>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>4.8 ★</p>
              </div>
            </div>
          )}

          {activeTab === "BUSINESS INFORMATION" && (
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {[
                  { label: "GST IN", value: "22AAAAA0000A1Z5" },
                  { label: "PAN NUMBER", value: "ABCDE1234F" },
                  { label: "REGISTERED ADDRESS", value: "123 Business Street, Tech Park, Mumbai" },
                  { label: "BANK ACCOUNT", value: "XXXX-XXXX-XXXX-1234" }
                ].map((info, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>{info.label}</span>
                    <div style={{ border: "1px solid #cbd5e1", borderRadius: "16px", padding: "12px 16px", backgroundColor: "#fff", color: "#0f172a", fontSize: "15px" }}>
                      {info.value}
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === "PRODUCTS" && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Product Name</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Price</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Stock</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Wireless Headphones", price: "₹ 1,999", stock: "45", status: "Active" },
                    { name: "Smart Watch", price: "₹ 2,499", stock: "12", status: "Low Stock" },
                    { name: "Bluetooth Speaker", price: "₹ 999", stock: "0", status: "Out of Stock" }
                  ].map((prod, i) => (
                    <tr key={i}>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontWeight: "500" }}>{prod.name}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{prod.price}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{prod.stock}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
                        <span style={{ 
                          padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                          backgroundColor: prod.status === "Active" ? "#dcfce7" : prod.status === "Low Stock" ? "#fef08a" : "#fee2e2",
                          color: prod.status === "Active" ? "#166534" : prod.status === "Low Stock" ? "#854d0e" : "#991b1b"
                        }}>
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "CATEGORY" && (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {["Electronics", "Accessories", "Gadgets", "Smart Home"].map((cat, i) => (
                <span key={i} style={{ padding: "10px 20px", backgroundColor: "#f8fafc", borderRadius: "20px", border: "1px solid #cbd5e1", fontWeight: "600", color: "#334155" }}>
                  {cat}
                </span>
              ))}
            </div>
          )}

          {activeTab === "SUB-CATEGORY" && (
             <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
             {["Audio", "Wearables", "Speakers", "Lighting"].map((sub, i) => (
               <span key={i} style={{ padding: "10px 20px", backgroundColor: "#fff", borderRadius: "20px", border: "1px dashed #cbd5e1", fontWeight: "600", color: "#334155" }}>
                 {sub}
               </span>
             ))}
           </div>
          )}

          {activeTab === "COUPON" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {[
                { code: "FESTIVE50", discount: "50% OFF", expiry: "31 Dec 2026" },
                { code: "NEWVENDOR20", discount: "20% OFF", expiry: "30 Jun 2026" }
              ].map((coup, i) => (
                <div key={i} style={{ border: "2px dashed #cbd5e1", borderRadius: "16px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "20px", letterSpacing: "1px" }}>{coup.code}</h4>
                    <span style={{ fontSize: "14px", color: "#64748b" }}>Expires: {coup.expiry}</span>
                  </div>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>{coup.discount}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ORDERS" && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Order ID</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Date</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Total</th>
                    <th style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "#ORD-9912", date: "28 May 2026", total: "₹ 1,999", status: "Delivered" },
                    { id: "#ORD-9913", date: "29 May 2026", total: "₹ 4,998", status: "Processing" }
                  ].map((ord, i) => (
                    <tr key={i}>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontWeight: "500", fontFamily: "monospace" }}>{ord.id}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{ord.date}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{ord.total}</td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
                         <span style={{ 
                          padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                          backgroundColor: ord.status === "Delivered" ? "#dcfce7" : "#eff6ff",
                          color: ord.status === "Delivered" ? "#166534" : "#1d4ed8"
                        }}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "DETAILS" && (
            <div style={{ padding: "24px", border: "1px solid #e2e8f0", borderRadius: "16px", backgroundColor: "#f8fafc" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>Additional Notes</h3>
              <p style={{ color: "#475569", lineHeight: "1.6", fontSize: "15px", margin: 0 }}>
                This vendor specializes in high-quality electronic accessories and wearables. 
                They have consistently maintained a high rating and low return rate over the past 6 months.
                Priority support is enabled for this account.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default VendorProfilePage;
