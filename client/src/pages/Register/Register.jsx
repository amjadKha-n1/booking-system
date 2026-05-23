import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login", {
        state: { message: "Account created successfully! Please sign in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-left-content">
              <div className="auth-brand">
                <span className="brand-icon">◆</span>
                <h2 className="brand-name">MAISON LUXE</h2>
              </div>
              <h1 className="auth-welcome">Join the Elegance</h1>
              <p className="auth-subtitle">
                Create your account and unlock a world of luxury travel
                experiences. Your journey begins here.
              </p>
              <div className="auth-perks">
                <div className="perk">
                  <span className="perk-icon">◆</span>
                  <span>Curated luxury properties</span>
                </div>
                <div className="perk">
                  <span className="perk-icon">◆</span>
                  <span>Personal concierge service</span>
                </div>
                <div className="perk">
                  <span className="perk-icon">◆</span>
                  <span>Flexible cancellation policy</span>
                </div>
                <div className="perk">
                  <span className="perk-icon">◆</span>
                  <span>Exclusive member events</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2 className="form-title">Create Account</h2>

              {error && (
                <div className="error-alert">
                  <span className="error-dot"></span>
                  {error}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="auth-footer">
                <p>
                  Already have an account? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
