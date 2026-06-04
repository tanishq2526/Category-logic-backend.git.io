
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
  fontSize: "14px",
  background: "#f8fafc",
};

function Login() {
  // React Router navigation
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Success / Error message
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /**
   * Update form fields
   */
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear old messages when typing
    setMessage({
      type: "",
      text: "",
    });
  };

  /**
   * Redirect user according to role
   *
   * Admin  -> /admin/dashboard
   * Vendor -> /vendor/:slug/dashboard
   * User   -> /user/dashboard
   */
  const redirectByRole = (user) => {
    if (user.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
      return;
    }

    if (user.role === "vendor") {
      navigate(
        `/vendor/${user.vendorSlug}/dashboard`,
        {
          replace: true,
        }
      );
      return;
    }

    navigate("/user/dashboard", {
      replace: true,
    });
  };

  /**
   * Form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email.trim()) {
      return setMessage({
        type: "error",
        text: "Email is required",
      });
    }

    if (!form.password) {
      return setMessage({
        type: "error",
        text: "Password is required",
      });
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return setMessage({
          type: "error",
          text:
            data.message ||
            "Login failed",
        });
      }

      /**
       * Save token
       */
      localStorage.setItem(
        "token",
        data.token
      );

      /**
       * Save user object
       */
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage({
        type: "success",
        text: "Login successful",
      });

      /**
       * Redirect according to role
       */
      redirectByRole(data.user);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong",
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
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          borderRadius: "14px",
          padding: "35px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            marginBottom: "8px",
            color: "#0f172a",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "25px",
          }}
        >
          Login to your account
        </p>

        {/* Alert Message */}
        {message.text && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              background:
                message.type ===
                "error"
                  ? "#fee2e2"
                  : "#dcfce7",
              color:
                message.type ===
                "error"
                  ? "#dc2626"
                  : "#166534",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              handleChange(
                "email",
                e.target.value
              )
            }
            style={inputStyle}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              handleChange(
                "password",
                e.target.value
              )
            }
            style={inputStyle}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              border: "none",
              padding: "13px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: "600",
              fontSize: "15px",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(135deg,#667eea,#764ba2)",
            }}
          >
            {loading
              ? "Please Wait..."
              : "Login"}
          </button>
        </form>

        {/* Register Links */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#64748b",
            }}
          >
            Don't have an account?
          </p>

          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Create User Account
          </Link>

          <br />
          <br />

          <Link
            to="/register-vendor"
            style={{
              color: "#f59e0b",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Register as Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

