/*
 * Updated App.jsx
 * Added:
 * 1. OrderDetails page
 * 2. OrderDetailPage route
 * 3. Better admin layout
 * 4. Clean imports
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Category from "./pages/admin/Category";
import SubCategory from "./pages/admin/SubCategory";
import Product from "./pages/admin/Product";
import VariantProducts from "./pages/admin/VariantProducts";
import Coupons from "./pages/admin/Coupons";
import GiftCards from "./pages/admin/GiftCards";
import Profile from "./pages/admin/Profile";

import Login from "./pages/Login";
import UserHome from "./pages/UserHome";

// Orders
import OrderDetails from "./pages/admin/Orderdetail";
import OrderDetailPage from "./pages/admin/OrderDetailPage";

// Users
import UserManagementPage from "./pages/admin/usermanagmentPage";

// ─────────────────────────────────────────────────────────────
// Admin Layout
// ─────────────────────────────────────────────────────────────
function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="admin">
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f1f5f9",
        }}
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

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* User */}
        <Route
          path="/user/home"
          element={
            <ProtectedRoute role="user">
              <UserHome />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Orders List */}
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

        {/* Category */}
        <Route
          path="/admin/category"
          element={
            <AdminLayout>
              <Category />
            </AdminLayout>
          }
        />

        {/* Sub Category */}
        <Route
          path="/admin/subcategory"
          element={
            <AdminLayout>
              <SubCategory />
            </AdminLayout>
          }
        />

        {/* Products */}
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Product />
            </AdminLayout>
          }
        />

        {/* Variant Products */}
        <Route
          path="/admin/products/variants"
          element={
            <AdminLayout>
              <VariantProducts />
            </AdminLayout>
          }
        />

        {/* Coupons */}
        <Route
          path="/admin/coupons"
          element={
            <AdminLayout>
              <Coupons />
            </AdminLayout>
          }
        />

        {/* Gift Cards */}
        <Route
          path="/admin/giftcards"
          element={
            <AdminLayout>
              <GiftCards />
            </AdminLayout>
          }
        />

        {/* Profile */}
        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <Profile />
            </AdminLayout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// /*
//  * Handover note: Frontend route map.
//  * Defines public login/user pages, protected admin pages, and the shared AdminLayout
//  * that wraps admin screens with the sidebar.
//  *
//  * CHANGES vs original:
//  *  1. Uncommented and imported OrderDetails (list page) and OrderDetailPage (single order).
//  *  2. /admin/orders now renders <OrderDetails /> instead of nothing.
//  *  3. Added /admin/order-details/:id route for OrderDetailPage — this is the URL that
//  *     OrderDetails navigates to when the admin clicks "View Details" on any row.
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

// // ── Order pages (previously commented out / missing) ──────────────────────────
// import OrderDetails from "./pages/admin/Orderdetails"; // list page
// // import OrderDetailPage from "./pages/admin/OrderdetailPage"; // single order detail page

// // ── Shared admin shell ─────────────────────────────────────────────────────────
// function AdminLayout({ children }) {
//   return (
//     <ProtectedRoute role="admin">
//       <div
//         style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}
//       >
//         <Sidebar />
//         <main
//           style={{
//             marginLeft: "250px",
//             flex: 1,
//             minHeight: "100vh",
//             padding: "32px",
//             transition: "margin-left 0.25s",
//           }}
//         >
//           {children}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ── Public ── */}
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />

//         {/* ── User ── */}
//         <Route
//           path="/user/home"
//           element={
//             <ProtectedRoute role="user">
//               <UserHome />
//             </ProtectedRoute>
//           }
//         />

//         {/* ── Admin ── */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <AdminLayout>
//               <Dashboard />
//             </AdminLayout>
//           }
//         />

//         {/* Order list — shows all orders in a paginated, filterable table */}
//         <Route
//           path="/admin/orders"
//           element={
//             <AdminLayout>
//               <OrderDetails />
//             </AdminLayout>
//           }
//         />

//         {/*
//           Order detail — opened when admin clicks "View Details" on any row.
//           :id is the MongoDB _id of the order.
//           OrderDetailPage reads location.state.order when navigating from the list
//           (instant render), or fetches GET /api/orders/:id on direct URL / refresh.
//         */}
//         <Route
//           path="/admin/order-details/:id"
//           element={
//             <AdminLayout>
//               <OrderDetailPage />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/admin/category"
//           element={
//             <AdminLayout>
//               <Category />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/subcategory"
//           element={
//             <AdminLayout>
//               <SubCategory />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/products"
//           element={
//             <AdminLayout>
//               <Product />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/products/variants"
//           element={
//             <AdminLayout>
//               <VariantProducts />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/coupons"
//           element={
//             <AdminLayout>
//               <Coupons />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/giftcards"
//           element={
//             <AdminLayout>
//               <GiftCards />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/profile"
//           element={
//             <AdminLayout>
//               <Profile />
//             </AdminLayout>
//           }
//         />

//         {/* Catch-all → login */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// // /*
// //  * Handover note: Frontend route map.
// //  * Defines public login/user pages, protected admin pages, and the shared AdminLayout that wraps admin screens with the sidebar.
// //  */
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // import Sidebar from "./components/Sidebar";
// // import ProtectedRoute from "./components/ProtectedRoute";

// // import Dashboard from "./pages/admin/Dashboard";
// // import Category from "./pages/admin/Category";
// // import SubCategory from "./pages/admin/SubCategory";
// // import Product from "./pages/admin/Product";
// // import VariantProducts from "./pages/admin/VariantProducts";
// // import Coupons from "./pages/admin/Coupons";
// // import GiftCards from "./pages/admin/GiftCards";
// // import Profile from "./pages/admin/Profile";
// // // import Orders from "./pages/admin/Orders";
// // import Login from "./pages/Login";
// // import UserHome from "./pages/UserHome";

// // function AdminLayout({ children }) {
// //   return (
// //     <ProtectedRoute role="admin">
// //       <div
// //         style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}
// //       >
// //         <Sidebar />
// //         <main
// //           style={{
// //             marginLeft: "250px",
// //             flex: 1,
// //             minHeight: "100vh",
// //             padding: "32px",
// //             transition: "margin-left 0.25s",
// //           }}
// //         >
// //           {children}
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Navigate to="/login" replace />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route
// //           path="/user/home"
// //           element={
// //             <ProtectedRoute role="user">
// //               <UserHome />
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin/dashboard"
// //           element={
// //             <AdminLayout>
// //               <Dashboard />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/orders"
// //           element={
// //             <AdminLayout>
// //               {/* <Orders /> */}
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/category"
// //           element={
// //             <AdminLayout>
// //               <Category />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/subcategory"
// //           element={
// //             <AdminLayout>
// //               <SubCategory />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/products"
// //           element={
// //             <AdminLayout>
// //               <Product />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/products/variants"
// //           element={
// //             <AdminLayout>
// //               <VariantProducts />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/coupons"
// //           element={
// //             <AdminLayout>
// //               <Coupons />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/giftcards"
// //           element={
// //             <AdminLayout>
// //               <GiftCards />
// //             </AdminLayout>
// //           }
// //         />
// //         <Route
// //           path="/admin/profile"
// //           element={
// //             <AdminLayout>
// //               <Profile />
// //             </AdminLayout>
// //           }
// //         />

// //         <Route path="*" element={<Navigate to="/login" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;
