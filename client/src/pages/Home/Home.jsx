import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roomsAPI } from "../../services/api";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryRoom, setGalleryRoom] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % rooms.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [rooms.length]);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms();
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      console.log("Could not fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const openGallery = (room, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryRoom(room);
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryRoom(null);
    setGalleryIndex(0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (galleryRoom && galleryRoom.images) {
      setGalleryIndex((prev) => (prev + 1) % galleryRoom.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (galleryRoom && galleryRoom.images) {
      setGalleryIndex(
        (prev) =>
          (prev - 1 + galleryRoom.images.length) % galleryRoom.images.length
      );
    }
  };

  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const averagePrice =
    rooms.length > 0
      ? rooms.reduce((sum, room) => sum + parseFloat(room.price_per_night), 0) /
        rooms.length
      : 0;

  if (loading) {
    return (
      <div className="home">
        <div className="loading-screen">
          <div className="loading-logo">◆</div>
          <p>Loading exceptional properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section with Dynamic Slides */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>

        {rooms.length > 0 && (
          <div className="hero-slides">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`hero-slide ${
                  index === currentSlide ? "active" : ""
                }`}
              >
                <div className="hero-content">
                  <span className="hero-tag">FEATURED PROPERTY</span>
                  <h1 className="hero-title">{room.name}</h1>
                  <p className="hero-subtitle">{room.description}</p>
                  <div className="hero-room-details">
                    <span>Up to {room.capacity} guests</span>
                    <span className="detail-divider">•</span>
                    <span>
                      From ${parseFloat(room.price_per_night).toFixed(0)}/night
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {rooms.length > 1 && (
          <div className="hero-indicators">
            {rooms.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}

        <div className="hero-action">
          {isAuthenticated ? (
            <Link to="/book" className="hero-cta">
              <span>Reserve Your Stay</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <Link to="/register" className="hero-cta">
              <span>Begin Your Journey</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>

        <div className="hero-scroll">
          <span className="scroll-text">Scroll to discover</span>
          <div className="scroll-line">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">The Experience</span>
            <h2 className="section-title">Beyond Ordinary Luxury</h2>
            <p className="section-description">
              Every stay is curated to perfection, offering an unparalleled
              blend of comfort, elegance, and personalized service.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h3 className="feature-name">Curated Properties</h3>
              <p className="feature-text">
                Each property in our collection is hand-selected for its unique
                character, exceptional location, and outstanding quality.
              </p>
              <div className="feature-line"></div>
            </div>

            <div className="feature-item">
              <div className="feature-number">02</div>
              <h3 className="feature-name">Personal Concierge</h3>
              <p className="feature-text">
                Your dedicated concierge is available around the clock to
                arrange every detail of your perfect stay.
              </p>
              <div className="feature-line"></div>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <h3 className="feature-name">Seamless Experience</h3>
              <p className="feature-text">
                From booking to checkout, enjoy a friction-free experience
                designed around your comfort and convenience.
              </p>
              <div className="feature-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{rooms.length}</span>
            <span className="stat-label">Luxury Properties</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">{totalCapacity}</span>
            <span className="stat-label">Guest Capacity</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">${averagePrice.toFixed(0)}</span>
            <span className="stat-label">Avg Price/Night</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Concierge Service</span>
          </div>
        </div>
      </section>

      {/* Rooms Grid with Images */}
      <section className="rooms-preview">
        <div className="rooms-container">
          <div className="section-header">
            <span className="section-tag">Our Collection</span>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-description">
              Discover our most sought-after accommodations
            </p>
          </div>

          {rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => {
                const hasImages = room.images && room.images.length > 0;

                return (
                  <Link
                    to={isAuthenticated ? `/book/${room.id}` : "/login"}
                    key={room.id}
                    className="room-card-link"
                  >
                    <div className="room-card">
                      <div className="room-image">
                        {hasImages ? (
                          <div className="image-carousel">
                            <img
                              src={room.images[0].image_url}
                              alt={`${room.name} - Image 1`}
                              className="room-image-img"
                              onClick={(e) => openGallery(room, 0, e)}
                              style={{ cursor: "pointer" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentElement.querySelector(
                                  ".room-image-placeholder"
                                ).style.display = "flex";
                              }}
                            />
                            <div
                              className="room-image-placeholder"
                              style={{ display: "none" }}
                            >
                              <span className="room-initial">
                                {room.name.charAt(0)}
                              </span>
                            </div>
                            {room.images.length > 1 && (
                              <>
                                <div className="image-dots">
                                  {room.images.map((_, imgIndex) => (
                                    <span
                                      key={imgIndex}
                                      className={`image-dot ${
                                        imgIndex === 0 ? "active" : ""
                                      }`}
                                    />
                                  ))}
                                </div>
                                <button
                                  className="image-count-badge"
                                  onClick={(e) => openGallery(room, 0, e)}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <rect
                                      x="3"
                                      y="3"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      ry="2"
                                    />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                  {room.images.length} photos
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="room-image-placeholder">
                            <span className="room-initial">
                              {room.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="room-overlay">
                          <span className="overlay-text">
                            {isAuthenticated
                              ? "Book This Room"
                              : "Sign In to Book"}
                          </span>
                        </div>
                      </div>
                      <div className="room-details">
                        <div className="room-header">
                          <h3 className="room-name">{room.name}</h3>
                          <span className="room-capacity">
                            Up to {room.capacity} guests
                          </span>
                        </div>
                        <p className="room-description">{room.description}</p>
                        <div className="room-footer">
                          <span className="room-price">
                            ${parseFloat(room.price_per_night).toFixed(0)}
                            <small>/night</small>
                          </span>
                          <span className="room-link-arrow">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M5 12h14M12 5l7 7-7 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="no-rooms">
              <p>Our exclusive collection is being curated. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready for an Unforgettable Stay?</h2>
            <p className="cta-text">
              Join Maison Luxe and experience the pinnacle of hospitality. Your
              perfect retreat awaits.
            </p>
            <div className="cta-actions">
              {isAuthenticated ? (
                <Link to="/book" className="cta-primary-btn">
                  Reserve Now
                </Link>
              ) : (
                <Link to="/register" className="cta-primary-btn">
                  Create Account
                </Link>
              )}
              <Link
                to={isAuthenticated ? "/book" : "/login"}
                className="cta-secondary-btn"
              >
                {isAuthenticated ? "View Rooms" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">◆</span>
            <h3 className="footer-name">MAISON LUXE</h3>
            <p className="footer-tagline">
              Extraordinary stays, timeless memories.
            </p>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Maison Luxe. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Image Gallery Modal */}
      {galleryOpen && galleryRoom && (
        <div className="gallery-overlay" onClick={closeGallery}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={closeGallery}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="gallery-counter">
              {galleryIndex + 1} / {galleryRoom.images.length}
            </div>

            <div className="gallery-main">
              {galleryRoom.images.length > 1 && (
                <button className="gallery-nav prev" onClick={prevImage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              <img
                src={galleryRoom.images[galleryIndex].image_url}
                alt={`${galleryRoom.name} - Image ${galleryIndex + 1}`}
                className="gallery-image"
              />

              {galleryRoom.images.length > 1 && (
                <button className="gallery-nav next" onClick={nextImage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>

            {galleryRoom.images.length > 1 && (
              <div className="gallery-thumbnails">
                {galleryRoom.images.map((img, index) => (
                  <button
                    key={img.id}
                    className={`gallery-thumb ${
                      index === galleryIndex ? "active" : ""
                    }`}
                    onClick={() => setGalleryIndex(index)}
                  >
                    <img src={img.image_url} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="gallery-info">
              <h3>{galleryRoom.name}</h3>
              <p>{galleryRoom.description}</p>
              <div className="gallery-room-meta">
                <span>Up to {galleryRoom.capacity} guests</span>
                <span className="meta-divider">•</span>
                <span>
                  ${parseFloat(galleryRoom.price_per_night).toFixed(0)}/night
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
