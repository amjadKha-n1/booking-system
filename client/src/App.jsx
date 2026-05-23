import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Booking from "./pages/Booking/Booking";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import RoomsManagement from "./pages/Admin/RoomsManagement";
import BookingsManagement from "./pages/Admin/BookingsManagement";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:roomId"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="rooms" element={<RoomsManagement />} />
                <Route path="bookings" element={<BookingsManagement />} />
              </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const AdminOverview = () => {
  return (
    <div className="overview-grid">
      <div className="overview-card">
        <div className="overview-icon rooms-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <div className="overview-info">
          <h3>Manage Rooms</h3>
          <p>Add, edit, or remove room listings</p>
        </div>
        <Link to="/admin/rooms" className="overview-link">
          Manage →
        </Link>
      </div>

      <div className="overview-card">
        <div className="overview-icon bookings-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
          </svg>
        </div>
        <div className="overview-info">
          <h3>View Bookings</h3>
          <p>Monitor all reservations</p>
        </div>
        <Link to="/admin/bookings" className="overview-link">
          View →
        </Link>
      </div>

      <div className="overview-card">
        <div className="overview-icon site-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </div>
        <div className="overview-info">
          <h3>Visit Site</h3>
          <p>View your live website</p>
        </div>
        <Link to="/" className="overview-link">
          Visit →
        </Link>
      </div>
    </div>
  );
};

export default App;
