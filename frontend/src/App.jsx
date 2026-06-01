/*
 * App.jsx
 *
 * Central route map for the entire frontend.
 *
 * ─── Route groups ─────────────────────────────────────────────────────────────
 *
 *  PUBLIC
 *    /           → redirect to /login
 *    /login      → Login page (user / vendor / admin tabs)
 *
 *  USER  (role: "user")
 *    /user/home  → UserHome
 *
 *  ADMIN  (role: "admin")
 *    /admin/dashboard
 *    /admin/orders
 *    /admin/order-details/:id
 *    /admin/users
 *    /admin/category
 *    /admin/subcategory
 *    /admin/products
 *    /admin/products/variants
 *    /admin/coupons
 *    /admin/giftcards
 *    /admin/profile
 *    /admin/vendors              ← NEW  (admin vendor management)
 *
 *  VENDOR  (role: "vendor")
 *    /vendor/:vendorSlug/dashboard
 *    /vendor/:vendorSlug/categories
 *    /vendor/:vendorSlug/subcategories
 *    /vendor/:vendorSlug/products
 *    /vendor/:vendorSlug/coupons
 *    /vendor/:vendorSlug/orders
 *    /vendor/:vendorSlug/profile
 *
 * ─── Layout components ────────────────────────────────────────────────────────
 *
 *  AdminLayout   → wraps children in ProtectedRoute(role="admin") + admin Sidebar
 *  VendorLayout  → wraps children in ProtectedRoute(role="vendor") + VendorSidebar
 *
 * Changes from original App.jsx:
 *   - Added VendorLayout component
 *   - Added all /vendor/:vendorSlug/* routes
 *   - Added /admin/vendors route (placeholder — wire up page when built)
 *   - Vendor routes use :vendorSlug param so pages can read it via useParams()
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Shared components ──────────────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import VendorSidebar from "./components/VendorSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Admin pages ────────────────────────────────────────────────────────────────
import Dashboard from "./pages/admin/Dashboard";
import Category from "./pages/admin/Category";
import SubCategory from "./pages/admin/SubCategory";
import Product from "./pages/admin/Product";
import VariantProducts from "./pages/admin/VariantProducts";
import Coupons from "./pages/admin/Coupons";
import GiftCards from "./pages/admin/GiftCards";
import Profile from "./pages/admin/Profile";
import OrderDetails from "./pages/admin/Orderdetail";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import UserManagementPage from "./pages/admin/usermanagmentPage";
// import AdminVendors  from "./pages/admin/AdminVendors"; // ← uncomment when built

// ── Vendor pages ───────────────────────────────────────────────────────────────
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorCategories from "./pages/vendor/VendorCategories";
import VendorSubCategories from "./pages/vendor/VendorSubCategories";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorCoupons from "./pages/vendor/VendorCoupons";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProfile from "./pages/vendor/VendorProfile";

// ── Public pages ───────────────────────────────────────────────────────────────
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";

// ─────────────────────────────────────────────────────────────────────────────
// AdminLayout
// Wraps every admin page with the role guard + admin sidebar.
// Children are rendered inside the main content area to the right of the sidebar.
// ─────────────────────────────────────────────────────────────────────────────
function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="admin">
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: "250px",
            flex: 1,
            padding: "24px",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VendorLayout
// Wraps every vendor page with the role guard + vendor sidebar.
// Mirrors AdminLayout exactly — same structural pattern, different sidebar.
// ─────────────────────────────────────────────────────────────────────────────
function VendorLayout({ children }) {
  return (
    <ProtectedRoute role="vendor">
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}
      >
        <VendorSidebar />
        <main
          style={{
            marginLeft: "250px",
            flex: 1,
            padding: "24px",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// ─────────────────────────────────────────────────────────────
// Seller Layout
// ─────────────────────────────────────────────────────────────
function SellerLayout({ children }) {
  return (
    <ProtectedRoute role="user">
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f1f5f9",
        }}
      >
        <SellerSidebar />

        <main
          style={{
            marginLeft: "250px",
            flex: 1,
            padding: "24px",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App — route definitions
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ── User ── */}
        <Route
          path="/user/home"
          element={
            <ProtectedRoute role="user">
              <UserHome />
            </ProtectedRoute>
          }
        />

        {/* ════════════════════════════════════════
            ADMIN ROUTES
        ════════════════════════════════════════ */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <OrderDetails />
            </AdminLayout>
          }
        />

        {/* Users Management */}
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UserManagementPage />
            </AdminLayout>
          }
        />

        {/* Single Order Details */}
        <Route
          path="/admin/order-details/:id"
          element={
            <AdminLayout>
              <OrderDetailPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UserManagementPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/category"
          element={
            <AdminLayout>
              <Category />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/subcategory"
          element={
            <AdminLayout>
              <SubCategory />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Product />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/variants"
          element={
            <AdminLayout>
              <VariantProducts />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/coupons"
          element={
            <AdminLayout>
              <Coupons />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/giftcards"
          element={
            <AdminLayout>
              <GiftCards />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <Profile />
            </AdminLayout>
          }
        />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* Seller Routes */}
        {/* ───────────────────────────────────────────────────────────── */}

        {/*
        <Route
          path="/seller/orders"
          element={
            <SellerLayout>
              <SellerOrders />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/products"
          element={
            <SellerLayout>
              <SellerProducts />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/variants"
          element={
            <SellerLayout>
              <SellerVariants />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/payments"
          element={
            <SellerLayout>
              <SellerPayments />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/reports"
          element={
            <SellerLayout>
              <SellerReports />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/support"
          element={
            <SellerLayout>
              <SellerSupport />
            </SellerLayout>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <SellerLayout>
              <SellerProfile />
            </SellerLayout>
          }
        /> */}

        {/*
          Admin vendor management — uncomment when AdminVendors page is built:
          <Route path="/admin/vendors"
            element={<AdminLayout><AdminVendors /></AdminLayout>} />
        */}

        {/* ════════════════════════════════════════
            VENDOR ROUTES
            All scoped under /vendor/:vendorSlug/
            vendorSlug is read inside each page via useParams()
        ════════════════════════════════════════ */}
        <Route
          path="/vendor/:vendorSlug/dashboard"
          element={
            <VendorLayout>
              <VendorDashboard />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/categories"
          element={
            <VendorLayout>
              <VendorCategories />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/subcategories"
          element={
            <VendorLayout>
              <VendorSubCategories />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/products"
          element={
            <VendorLayout>
              <VendorProducts />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/coupons"
          element={
            <VendorLayout>
              <VendorCoupons />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/orders"
          element={
            <VendorLayout>
              <VendorOrders />
            </VendorLayout>
          }
        />

        <Route
          path="/vendor/:vendorSlug/profile"
          element={
            <VendorLayout>
              <VendorProfile />
            </VendorLayout>
          }
        />

        {/* ── 404 → login ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// /*
//  * Updated App.jsx
//  * Added:
//  * 1. OrderDetails page
//  * 2. OrderDetailPage route
//  * 3. Better admin layout
//  * 4. Clean imports
//  */

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Sidebar from "./components/Sidebar";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Dashboard from "./pages/admin/Dashboard";
// import Category from "./pages/admin/Category";
// import SubCategory from "./pages/admin/SubCategory";
// import Product from "./pages/admin/Product";
// import VariantProducts from "./pages/admin/VariantProducts";
// import Coupons from "./pages/admin/Coupons";
// import GiftCards from "./pages/admin/GiftCards";
// import Profile from "./pages/admin/Profile";

// import Login from "./pages/Login";
// import UserHome from "./pages/UserHome";

// // Orders
// import OrderDetails from "./pages/admin/Orderdetail";
// import OrderDetailPage from "./pages/admin/OrderDetailPage";

// // Users
// import UserManagementPage from "./pages/admin/usermanagmentPage";

// // ─────────────────────────────────────────────────────────────
// // Admin Layout
// // ─────────────────────────────────────────────────────────────
// function AdminLayout({ children }) {
//   return (
//     <ProtectedRoute role="admin">
//       <div
//         style={{
//           display: "flex",
//           minHeight: "100vh",
//           background: "#f1f5f9",
//         }}
//       >
//         <Sidebar />

//         <main
//           style={{
//             marginLeft: "250px",
//             flex: 1,
//             padding: "24px",
//             minHeight: "100vh",
//             overflowX: "hidden",
//           }}
//         >
//           {children}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // App
// // ─────────────────────────────────────────────────────────────
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />

//         {/* User */}
//         <Route
//           path="/user/home"
//           element={
//             <ProtectedRoute role="user">
//               <UserHome />
//             </ProtectedRoute>
//           }
//         />

//         {/* Admin Dashboard */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <AdminLayout>
//               <Dashboard />
//             </AdminLayout>
//           }
//         />

//         {/* Orders List */}
//         <Route
//           path="/admin/orders"
//           element={
//             <AdminLayout>
//               <OrderDetails />
//             </AdminLayout>
//           }
//         />

//         {/* Users Management */}
//         <Route
//           path="/admin/users"
//           element={
//             <AdminLayout>
//               <UserManagementPage />
//             </AdminLayout>
//           }
//         />

//         {/* Single Order Details */}
//         <Route
//           path="/admin/order-details/:id"
//           element={
//             <AdminLayout>
//               <OrderDetailPage />
//             </AdminLayout>
//           }
//         />

//         {/* Category */}
//         <Route
//           path="/admin/category"
//           element={
//             <AdminLayout>
//               <Category />
//             </AdminLayout>
//           }
//         />

//         {/* Sub Category */}
//         <Route
//           path="/admin/subcategory"
//           element={
//             <AdminLayout>
//               <SubCategory />
//             </AdminLayout>
//           }
//         />

//         {/* Products */}
//         <Route
//           path="/admin/products"
//           element={
//             <AdminLayout>
//               <Product />
//             </AdminLayout>
//           }
//         />

//         {/* Variant Products */}
//         <Route
//           path="/admin/products/variants"
//           element={
//             <AdminLayout>
//               <VariantProducts />
//             </AdminLayout>
//           }
//         />

//         {/* Coupons */}
//         <Route
//           path="/admin/coupons"
//           element={
//             <AdminLayout>
//               <Coupons />
//             </AdminLayout>
//           }
//         />

//         {/* Gift Cards */}
//         <Route
//           path="/admin/giftcards"
//           element={
//             <AdminLayout>
//               <GiftCards />
//             </AdminLayout>
//           }
//         />

//         {/* Profile */}
//         <Route
//           path="/admin/profile"
//           element={
//             <AdminLayout>
//               <Profile />
//             </AdminLayout>
//           }
//         />

//         {/* 404 */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
