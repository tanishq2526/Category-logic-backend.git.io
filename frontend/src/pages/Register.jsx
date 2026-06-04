
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc",
  padding: "30px 20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "35px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
};

const headingStyle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#0f172a",
  marginBottom: "8px",
};

const subHeadingStyle = {
  color: "#64748b",
  marginBottom: "28px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "10px",
};

const footerStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "600",
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const validate = () => {
    if (!form.name.trim())
      return "Name is required";

    if (!form.email.trim())
      return "Email is required";

    if (!form.password)
      return "Password is required";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      return setMessage({
        type: "error",
        text: error,
      });
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
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
            "Registration failed",
        });
      }

      setMessage({
        type: "success",
        text:
          "Account created successfully. Redirecting...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
    <div style={pageStyle}>
  <div style={cardStyle}>
    <h1 style={headingStyle}>
      Create User Account
    </h1>

    <p style={subHeadingStyle}>
      Register to start shopping
    </p>

    <form
      onSubmit={handleSubmit}
      style={formStyle}
    >
      <div>
        <label style={labelStyle}>
          Full Name
        </label>
        <input
          style={inputStyle}
          type="text"
          value={form.name}
          onChange={(e) =>
            handleChange(
              "name",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Email Address
        </label>
        <input
          style={inputStyle}
          type="email"
          value={form.email}
          onChange={(e) =>
            handleChange(
              "email",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Phone Number
        </label>
        <input
          style={inputStyle}
          type="text"
          value={form.phone}
          onChange={(e) =>
            handleChange(
              "phone",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Password
        </label>
        <input
          style={inputStyle}
          type="password"
          value={form.password}
          onChange={(e) =>
            handleChange(
              "password",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Confirm Password
        </label>
        <input
          style={inputStyle}
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            handleChange(
              "confirmPassword",
              e.target.value
            )
          }
        />
      </div>

      <button
        type="submit"
        style={buttonStyle}
      >
        Register
      </button>
    </form>

    <div style={footerStyle}>
      <Link
        to="/register-vendor"
        style={linkStyle}
      >
        Register as Vendor
      </Link>

      <br />
      <br />

      <Link
        to="/login"
        style={linkStyle}
      >
        Back to Login
      </Link>
    </div>
  </div>
</div>
  );
}

export default Register;
