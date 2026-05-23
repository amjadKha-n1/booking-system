import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingAPI, roomsAPI, paymentAPI } from "../../services/api";
import "./Booking.css";

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && roomId) {
      const room = rooms.find((r) => r.id === parseInt(roomId));
      if (room) {
        setSelectedRoom(room);
      }
    }
  }, [rooms, roomId]);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms();
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      setError("Failed to load rooms.");
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    navigate(`/book/${room.id}`, { replace: true });
  };

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    return calculateNights() * parseFloat(selectedRoom.price_per_night);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRoom) {
      setError("Please select a room");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (calculateNights() <= 0) {
      setError("Check-out date must be after check-in date");
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const bookingResponse = await bookingAPI.createBooking({
        roomId: selectedRoom.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      console.log("Booking response:", bookingResponse.data);

      let bookingId = null;
      if (bookingResponse.data.booking) {
        bookingId = bookingResponse.data.booking.id;
      } else if (bookingResponse.data.data) {
        bookingId = bookingResponse.data.data.id;
      } else if (bookingResponse.data.id) {
        bookingId = bookingResponse.data.id;
      }

      if (!bookingId) {
        throw new Error("Could not create booking. Please try again.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentResponse = await paymentAPI.createPayment({
        bookingId: bookingId,
        amount: calculateTotal(),
        paymentMethod: paymentData.paymentMethod,
      });

      console.log("Payment response:", paymentResponse.data);

      if (paymentResponse.data.success) {
        setBookingResult({
          id: bookingId,
          roomName: selectedRoom.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalAmount: calculateTotal(),
        });
        setSuccess(
          `Payment successful! Your booking #${bookingId} is confirmed.`
        );
        setStep(3);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  if (loadingRooms) {
    return (
      <div className="booking-page">
        <div className="booking-loading">
          <div className="loading-logo">◆</div>
          <p>Preparing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Steps Indicator */}
        <div className="steps-indicator">
          <div
            className={`step ${step >= 1 ? "active" : ""} ${
              step > 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">1</div>
            <span className="step-label">Room & Dates</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step ${step >= 2 ? "active" : ""} ${
              step > 2 ? "completed" : ""
            }`}
          >
            <div className="step-number">2</div>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        {error && (
          <div className="booking-error">
            <span className="error-dot"></span>
            {error}
          </div>
        )}

        {/* Step 1: Room & Date Selection */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="booking-form">
            <div className="booking-header">
              <span className="booking-tag">RESERVATION</span>
              <h1 className="booking-title">
                {selectedRoom ? selectedRoom.name : "Select Your Room"}
              </h1>
              <p className="booking-subtitle">Choose your room and dates</p>
            </div>

            <div className="booking-section">
              <h3 className="section-label">Choose Your Room</h3>
              <div className="rooms-selection-grid">
                {rooms.map((room) => {
                  const hasImages = room.images && room.images.length > 0;
                  const firstImage = hasImages
                    ? room.images[0].image_url
                    : null;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      className={`room-select-card ${
                        selectedRoom?.id === room.id ? "active" : ""
                      }`}
                      onClick={() => handleRoomSelect(room)}
                    >
                      <div className="room-select-image">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={room.name}
                            className="room-select-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}
                        <span
                          className="room-select-initial"
                          style={{ display: firstImage ? "none" : "flex" }}
                        >
                          {room.name.charAt(0)}
                        </span>
                      </div>
                      <div className="room-select-info">
                        <h4 className="room-select-name">{room.name}</h4>
                        <p className="room-select-desc">{room.description}</p>
                        <div className="room-select-meta">
                          <span>Up to {room.capacity} guests</span>
                          <span className="meta-divider">•</span>
                          <span className="room-select-price">
                            ${parseFloat(room.price_per_night).toFixed(0)}/night
                          </span>
                        </div>
                      </div>
                      {selectedRoom?.id === room.id && (
                        <div className="selected-indicator">Selected</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="booking-section">
              <h3 className="section-label">Select Dates</h3>
              <div className="dates-selection">
                <div className="date-field">
                  <label htmlFor="startDate">Check-in</label>
                  <input
                    id="startDate"
                    type="date"
                    min={today}
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="date-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="date-field">
                  <label htmlFor="endDate">Check-out</label>
                  <input
                    id="endDate"
                    type="date"
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {selectedRoom && calculateNights() > 0 && (
              <div className="booking-section">
                <h3 className="section-label">Reservation Summary</h3>
                <div className="summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Room</span>
                    <span className="summary-value">{selectedRoom.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Price per night</span>
                    <span className="summary-value">
                      ${parseFloat(selectedRoom.price_per_night).toFixed(0)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Number of nights</span>
                    <span className="summary-value">{calculateNights()}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-total">
                      ${calculateTotal().toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="submit-booking-btn"
              disabled={
                !selectedRoom || !formData.startDate || !formData.endDate
              }
            >
              Proceed to Payment
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="booking-form">
            <div className="booking-header">
              <span className="booking-tag">PAYMENT</span>
              <h1 className="booking-title">Complete Your Booking</h1>
              <p className="booking-subtitle">
                Secure payment for {selectedRoom?.name}
              </p>
            </div>

            <div className="booking-section">
              <h3 className="section-label">Booking Details</h3>
              <div className="summary-card">
                <div className="summary-row">
                  <span className="summary-label">Room</span>
                  <span className="summary-value">{selectedRoom?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Check-in</span>
                  <span className="summary-value">{formData.startDate}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Check-out</span>
                  <span className="summary-value">{formData.endDate}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Nights</span>
                  <span className="summary-value">{calculateNights()}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span className="summary-label">Total to Pay</span>
                  <span className="summary-total">
                    ${calculateTotal().toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="booking-section">
              <h3 className="section-label">Payment Method</h3>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method-btn ${
                    paymentData.paymentMethod === "card" ? "active" : ""
                  }`}
                  onClick={() =>
                    setPaymentData({ ...paymentData, paymentMethod: "card" })
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${
                    paymentData.paymentMethod === "bank_transfer"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentData({
                      ...paymentData,
                      paymentMethod: "bank_transfer",
                    })
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                  </svg>
                  Bank Transfer
                </button>
              </div>

              <div className="payment-form-fields">
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      value={paymentData.expiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="submit-booking-btn"
              disabled={loading}
            >
              {loading
                ? "Processing Payment..."
                : `Pay $${calculateTotal().toFixed(0)}`}
            </button>
            <button
              type="button"
              className="back-btn"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="booking-form">
            <div className="booking-success large">
              <span className="success-icon">✓</span>
              <div className="success-content">
                <h4>Booking Confirmed!</h4>
                <p>
                  Your reservation has been confirmed and payment has been
                  processed successfully.
                </p>
                {bookingResult && (
                  <div className="confirmation-details">
                    <div className="confirm-row">
                      <span>Booking ID</span>
                      <strong>#{bookingResult.id}</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Room</span>
                      <strong>{bookingResult.roomName}</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Dates</span>
                      <strong>
                        {bookingResult.startDate} to {bookingResult.endDate}
                      </strong>
                    </div>
                    <div className="confirm-row">
                      <span>Amount Paid</span>
                      <strong className="gold">
                        ${bookingResult.totalAmount.toFixed(0)}
                      </strong>
                    </div>
                  </div>
                )}
                <button
                  className="submit-booking-btn"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
