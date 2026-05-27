/*
 * Handover note: Login/register screen.
 * Sends credentials to /api/auth endpoints, stores returned token/user in localStorage, and routes admins/users to their correct landing page.
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

  const title = useMemo(() => {
    if (isRegister) return isAdmin ? "Create Admin Account" : "Create User Account";
    return isAdmin ? "Admin Login" : "User Login";
  }, [isAdmin, isRegister]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage({ type: "", text: "" });
  };

  const resetForm = () => {
    setForm(initialForm);
    setMessage({ type: "", text: "" });
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetForm();
  };

  const switchAccountType = (nextType) => {
    setAccountType(nextType);
    setMessage({ type: "", text: "" });
  };

  const redirectByRole = (user) => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    navigate("/user/home", { replace: true });
  };

  const validate = () => {
    if (!form.email.trim() || !form.password) {
      return "Email and password are required";
    }

    if (isRegister) {
      if (!form.name.trim()) return "Name is required";
      if (form.password.length < 6) return "Password must be at least 6 characters";
      if (form.password !== form.confirmPassword) return "Passwords do not match";
      if (isAdmin && !form.secretKey.trim()) return "Admin secret key is required";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const endpoint = isRegister
        ? isAdmin
          ? "/api/auth/register-admin"
          : "/api/auth/register"
        : "/api/auth/login";

      const payload = isRegister
        ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            ...(isAdmin && { secretKey: form.secretKey }),
          }
        : {
            email: form.email,
            password: form.password,
          };

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

      if (!isRegister && data.user?.role !== accountType) {
        setMessage({
          type: "error",
          text: `This account is registered as ${data.user?.role}. Select ${data.user?.role} to continue.`,
        });
        return;
      }

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          {["user", "admin"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchAccountType(item)}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "10px 12px",
                cursor: "pointer",
                fontWeight: "600",
                color: accountType === item ? "#1a1a2e" : "#64748b",
                background: accountType === item ? "#eef2ff" : "white",
              }}
            >
              {item === "user" ? "User" : "Admin"}
            </button>
          ))}
        </div>

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

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: 0,
            margin: 0,
            boxShadow: "none",
            borderRadius: 0,
          }}
        >
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

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
                ? `Create ${isAdmin ? "Admin" : "User"} Account`
                : `Login as ${isAdmin ? "Admin" : "User"}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
