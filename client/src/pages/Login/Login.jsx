import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      login(token, user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
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
              <h1 className="auth-welcome">Welcome Back</h1>
              <p className="auth-subtitle">
                Sign in to access your exclusive membership benefits and manage
                your reservations.
              </p>
              <div className="auth-perks">
                <div className="perk">
                  <span className="perk-icon">✓</span>
                  <span>Priority booking access</span>
                </div>
                <div className="perk">
                  <span className="perk-icon">✓</span>
                  <span>Exclusive member rates</span>
                </div>
                <div className="perk">
                  <span className="perk-icon">✓</span>
                  <span>24/7 concierge support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2 className="form-title">Sign In</h2>

              {error && (
                <div className="error-alert">
                  <span className="error-dot"></span>
                  {error}
                </div>
              )}

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
                  autoComplete="email"
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
                  "Sign In"
                )}
              </button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Create Account</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
