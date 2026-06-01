/*
 * pages/Login.jsx
 *
 * Handles login and registration for three account types:
 *   - user   → redirects to /user/home
 *   - admin  → redirects to /admin/dashboard
 *   - vendor → redirects to /vendor/:slug/dashboard
 *
 * Auth state storage (localStorage):
 *   token  → JWT string
 *   user   → JSON object { _id, name, email, role, vendorSlug? }
 *
 * Changes from original:
 *   - Added "vendor" as a third account type tab
 *   - Vendor register form adds shopName field
 *   - redirectByRole handles role === "vendor" → /vendor/:slug/dashboard
 *   - Login response for vendors must include user.vendorSlug
 *     (your auth controller should return it — check authController.js)
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  secretKey: "",
  shopName: "", // vendor only
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  flex: "none",
  padding: "12px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  background: "#f8fafc",
  fontSize: "14px",
};

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [accountType, setAccountType] = useState("user");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const isAdmin = accountType === "admin";
  const isVendor = accountType === "vendor";

  const title = useMemo(() => {
    if (isRegister) {
      if (isAdmin) return "Create Admin Account";
      if (isVendor) return "Register Your Store";
      return "Create User Account";
    }
    if (isAdmin) return "Admin Login";
    if (isVendor) return "Vendor Login";
    return "User Login";
  }, [isAdmin, isVendor, isRegister]);

  const updateForm = (key, value) => {
    setForm((c) => ({ ...c, [key]: value }));
    setMessage({ type: "", text: "" });
  };

  const resetForm = () => {
    setForm(initialForm);
    setMessage({ type: "", text: "" });
  };

  const switchMode = (next) => {
    setMode(next);
    resetForm();
  };
  const switchAccountType = (next) => {
    setAccountType(next);
    setMessage({ type: "", text: "" });
  };

  // ── Redirect after successful login ────────────────────────────────────────
  // For vendors, the login response must include user.vendorSlug.
  // Your auth controller (authController.js → loginUser) should return:
  //   { success: true, token, user: { _id, name, email, role: "vendor", vendorSlug: "nike-store" } }
  const redirectByRole = (user) => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user?.role === "vendor") {
      // vendorSlug comes from the login response → stored on user object
      const slug = user?.vendorSlug;
      if (!slug) {
        setMessage({
          type: "error",
          text: "Vendor slug missing. Contact support.",
        });
        return;
      }
      navigate(`/vendor/${slug}/dashboard`, { replace: true });
    } else {
      navigate("/user/home", { replace: true });
    }
  };

  // ── Form validation ─────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.email.trim() || !form.password)
      return "Email and password are required";

    if (isRegister) {
      if (!form.name.trim()) return "Name is required";
      if (form.password.length < 6)
        return "Password must be at least 6 characters";
      if (form.password !== form.confirmPassword)
        return "Passwords do not match";
      if (isAdmin && !form.secretKey.trim())
        return "Admin secret key is required";
      if (isVendor && !form.shopName.trim()) return "Shop name is required";
    }
    return "";
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMessage({ type: "error", text: err });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Pick the correct endpoint based on mode + account type
      const endpoint = isRegister
        ? isAdmin
          ? "/api/auth/register-admin"
          : isVendor
            ? "/api/auth/register-vendor"
            : "/api/auth/register"
        : "/api/auth/login";

      const payload = isRegister
        ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            ...(isAdmin && { secretKey: form.secretKey }),
            ...(isVendor && { shopName: form.shopName }),
          }
        : { email: form.email, password: form.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage({
          type: "error",
          text: data.message || "Authentication failed",
        });
        return;
      }

      // On login: make sure the selected tab matches the account's actual role
      if (!isRegister && data.user?.role !== accountType) {
        setMessage({
          type: "error",
          text: `This account is a ${data.user?.role}. Please select "${data.user?.role}" to continue.`,
        });
        return;
      }

      // Vendor registration success — show message, don't redirect yet
      // (account is "pending" until admin approves)
      if (isRegister && isVendor) {
        setMessage({
          type: "success",
          text: "Store registered! Your account is pending admin approval. You'll be able to login once approved.",
        });
        resetForm();
        setMode("login");
        return;
      }

      // Save to localStorage and redirect
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      redirectByRole(data.user);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "36px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "430px",
        }}
      >
        <h1 style={{ marginBottom: "8px", color: "#1a1a2e" }}>{title}</h1>
        <p style={{ marginBottom: "22px", color: "#64748b", fontSize: "14px" }}>
          Sign in or register with the account type you need.
        </p>

        {/* ── Login / Register toggle ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {["login", "register"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchMode(item)}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "10px 12px",
                cursor: "pointer",
                fontWeight: "600",
                color: mode === item ? "white" : "#475569",
                background:
                  mode === item
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "#f1f5f9",
              }}
            >
              {item === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {/* ── Account type tabs: user / vendor / admin ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          {["user", "vendor", "admin"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchAccountType(item)}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "10px 8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                color: accountType === item ? "#1a1a2e" : "#64748b",
                background: accountType === item ? "#eef2ff" : "white",
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Message banner ── */}
        {message.text && (
          <div
            style={{
              background: message.type === "error" ? "#ffe0e0" : "#dcfce7",
              color: message.type === "error" ? "#e94560" : "#166534",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {message.text}
          </div>
        )}

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: 0,
            margin: 0,
          }}
        >
          {/* Register-only fields */}
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                style={inputStyle}
              />
              {/* Shop name — vendor register only */}
              {isVendor && (
                <input
                  type="text"
                  placeholder="Shop name (e.g. Nike Store)"
                  value={form.shopName}
                  onChange={(e) => updateForm("shopName", e.target.value)}
                  style={inputStyle}
                />
              )}
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => updateForm("password", e.target.value)}
            style={inputStyle}
          />

          {isRegister && (
            <>
              <input
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) => updateForm("confirmPassword", e.target.value)}
                style={inputStyle}
              />
              {/* Admin secret key — admin register only */}
              {isAdmin && (
                <input
                  type="password"
                  placeholder="Admin secret key"
                  value={form.secretKey}
                  onChange={(e) => updateForm("secretKey", e.target.value)}
                  style={inputStyle}
                />
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "14px",
              color: "white",
              background: loading
                ? "#94a3b8"
                : isVendor
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? `Create ${isAdmin ? "Admin" : isVendor ? "Vendor" : "User"} Account`
                : `Login as ${isAdmin ? "Admin" : isVendor ? "Vendor" : "User"}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
