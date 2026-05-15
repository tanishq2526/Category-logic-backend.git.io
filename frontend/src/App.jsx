import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Category from "./pages/admin/Category";
import SubCategory from "./pages/admin/SubCategory";
import Product from "./pages/admin/Product";
import VariantProducts from "./pages/admin/VariantProducts";
import Coupons from "./pages/admin/Coupons";
// import UserProfile from "./pages/admin/UserProfile";
// import Orders from "./pages/admin/Orders";
import Login from "./pages/Login";

function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: "250px",
            flex: 1,
            minHeight: "100vh",
            padding: "32px",
            transition: "margin-left 0.25s",
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

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
              {/* <Orders /> */}
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
          path="/admin/profile"
          element={
            <AdminLayout>
              {/* <UserProfile /> */}
            </AdminLayout>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
