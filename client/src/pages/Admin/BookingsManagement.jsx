import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import "./Admin.css";

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus);
      setSuccess(`Booking #${bookingId} status updated to ${newStatus}`);
      fetchBookings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setTimeout(() => setError(""), 4000);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "cancelled":
        return "status-cancelled";
      case "pending":
        return "status-pending";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Booking Management</h2>
          <p className="page-subtitle">Monitor all reservations and payments</p>
        </div>
        <div className="page-stats">
          <div className="stat-badge">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {bookings.filter((b) => b.status === "confirmed").length}
            </span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {bookings.filter((b) => b.status === "pending").length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <span className="error-dot"></span>
          {error}
        </div>
      )}
      {success && (
        <div className="admin-success">
          <span className="success-icon">✓</span>
          {success}
        </div>
      )}

      <div className="filter-tabs">
        {["all", "pending", "confirmed", "cancelled", "completed"].map(
          (status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      <div className="table-card">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Booked On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="td-id">#{booking.id}</td>
                    <td className="td-name">
                      {booking.user_name || `User #${booking.user_id}`}
                    </td>
                    <td className="td-name">
                      {booking.room_name || `Room #${booking.room_id}`}
                    </td>
                    <td className="td-date">
                      {new Date(booking.start_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="td-date">
                      {new Date(booking.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.payment_status ? (
                        <div className="payment-info">
                          <span className="payment-badge paid">Paid</span>
                          <span className="payment-amount">
                            ${parseFloat(booking.payment_amount).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="payment-badge unpaid">Unpaid</span>
                      )}
                    </td>
                    <td className="td-date">
                      {new Date(booking.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="td-actions">
                      <div className="action-dropdown">
                        <button
                          className="action-btn status-btn"
                          title="Change Status"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div className="dropdown-menu">
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "pending")
                            }
                          >
                            <span className="status-dot pending"></span>
                            Pending
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                          >
                            <span className="status-dot confirmed"></span>
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "completed")
                            }
                          >
                            <span className="status-dot completed"></span>
                            Complete
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "cancelled")
                            }
                          >
                            <span className="status-dot cancelled"></span>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManagement;
