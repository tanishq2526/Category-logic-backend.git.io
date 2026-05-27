import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../components/SearchFilterBar";
import OrderTable from "../../components/OrderTable";

const initialOrders = [
  {
    id: "ORD-1001",
    userId: "USR-2101",
    productId: "PRD-3401",
    price: 1799,
    phone: "+91 98765 43210",
    date: "2026-05-10",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    userName: "Himanshu Verma",
    userAddress: "45 Pearl Avenue, Sector 18, Noida",
    email: "himanshu.verma@example.com",
    productName: "Wireless Noise Cancelling Headphones",
    warehouse: "Logic Warehouse #4",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    businessPhone: "+91 120 456 7890",
    gst: 162,
    discount: 200,
    couponDiscount: 150,
    actualPrice: 1799,
    totalPrice: 1611,
  },
  {
    id: "ORD-1002",
    userId: "USR-2108",
    productId: "PRD-3418",
    price: 2599,
    phone: "+91 91234 56780",
    date: "2026-05-16",
    paymentStatus: "Pending",
    orderStatus: "Shipped",
    userName: "Riya Sharma",
    userAddress: "B-12, Garden Town, Jaipur",
    email: "riya.sharma@example.com",
    productName: "Smart Fitness Watch",
    warehouse: "South Logistics Hub",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302015",
    businessPhone: "+91 141 789 0123",
    gst: 234,
    discount: 250,
    couponDiscount: 0,
    actualPrice: 2599,
    totalPrice: 2583,
  },
  {
    id: "ORD-1003",
    userId: "USR-2114",
    productId: "PRD-3399",
    price: 499,
    phone: "+91 99876 54321",
    date: "2026-05-08",
    paymentStatus: "Failed",
    orderStatus: "Ordered",
    userName: "Ankit Patel",
    userAddress: "Flat 200, Sunrise Apartments, Surat",
    email: "ankit.patel@example.com",
    productName: "USB-C Travel Adapter Set",
    warehouse: "Western Storage Center",
    city: "Surat",
    state: "Gujarat",
    pincode: "395009",
    businessPhone: "+91 261 654 3210",
    gst: 44,
    discount: 50,
    couponDiscount: 20,
    actualPrice: 499,
    totalPrice: 473,
  },
  {
    id: "ORD-1004",
    userId: "USR-2120",
    productId: "PRD-3221",
    price: 8999,
    phone: "+91 90123 45678",
    date: "2026-05-18",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    userName: "Simran Kaur",
    userAddress: "23 Lakeview Road, Lucknow",
    email: "simran.kaur@example.com",
    productName: "Premium Laptop Backpack",
    warehouse: "North Logistics Hub",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
    businessPhone: "+91 522 123 4567",
    gst: 810,
    discount: 650,
    couponDiscount: 100,
    actualPrice: 8999,
    totalPrice: 9169,
  },
  {
    id: "ORD-1005",
    userId: "USR-2132",
    productId: "PRD-3333",
    price: 1249,
    phone: "+91 93456 71234",
    date: "2026-05-20",
    paymentStatus: "Pending",
    orderStatus: "Ordered",
    userName: "Neha Singh",
    userAddress: "12 Orchid Street, Pune",
    email: "neha.singh@example.com",
    productName: "Bluetooth Portable Speaker",
    warehouse: "Central Distribution",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    businessPhone: "+91 20 3456 7890",
    gst: 112,
    discount: 120,
    couponDiscount: 30,
    actualPrice: 1249,
    totalPrice: 1231,
  },
];

export default function OrderDetailsPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [date, setDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 4;

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query) ||
        order.productId.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query);

      const matchesStatus = !orderStatus || order.orderStatus === orderStatus;
      const matchesPayment = !paymentStatus || order.paymentStatus === paymentStatus;
      const matchesDate = !date || order.date === date;

      return matchesQuery && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchQuery, orderStatus, paymentStatus, date]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pageOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    // navigate to dedicated order detail page, passing order data in location state
    navigate(`/admin/order-details/${order.id}`, { state: { order } });
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order,
      ),
    );

    setSelectedOrder((current) =>
      current?.id === orderId ? { ...current, orderStatus: newStatus } : current,
    );
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        <section
          style={{
            background: "#f8fafc",
            borderRadius: "24px",
            padding: "26px 28px",
            boxShadow: "0 1px 10px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Order Details
          </h1>
          <p
            style={{
              marginTop: "10px",
              color: "#475569",
              fontSize: "15px",
            }}
          >
            Monitor order history, payment status, and fulfillment details in one
            dashboard.
          </p>
        </section>

        <SearchFilterBar
          searchQuery={searchQuery}
          orderStatus={orderStatus}
          paymentStatus={paymentStatus}
          date={date}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          onOrderStatusChange={(value) => {
            setOrderStatus(value);
            setCurrentPage(1);
          }}
          onPaymentStatusChange={(value) => {
            setPaymentStatus(value);
            setCurrentPage(1);
          }}
          onDateChange={(value) => {
            setDate(value);
            setCurrentPage(1);
          }}
        />

        <div style={{ display: "grid", gap: "20px" }}>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "24px",
              boxShadow: "0 1px 10px rgba(15, 23, 42, 0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Orders Overview
                </h2>
                <p style={{ marginTop: "8px", color: "#64748b" }}>
                  Filter orders quickly and open details on demand.
                </p>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "16px",
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {filteredOrders.length} orders found
              </div>
            </div>
          </div>
          <OrderTable
            orders={pageOrders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {/* detail page now opens via route; no inline detail rendering here */}
      </div>
    </div>
  );
}

const badgeStyles = {
  Ordered: { background: "#e0f2fe", color: "#0c4a6e" },
  Shipped: { background: "#ede9fe", color: "#5b21b6" },
  Delivered: { background: "#d1fae5", color: "#166534" },
  Pending: { background: "#fef3c7", color: "#92400e" },
  Processing: { background: "#fef9c3", color: "#854d0e" },
  Cancelled: { background: "#fee2e2", color: "#b91c1c" },
  Paid: { background: "#dcfce7", color: "#166534" },
  Failed: { background: "#fee2e2", color: "#991b1b" },
};
// badgeStyles used for inline badges and selects
