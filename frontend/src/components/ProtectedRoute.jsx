/*
 * Handover note: Frontend route guard.
 * Reads token/user from localStorage and redirects visitors away from protected pages when login or role is missing.
 */
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/user/home"} />;
  }

  return children;
}

export default ProtectedRoute;
