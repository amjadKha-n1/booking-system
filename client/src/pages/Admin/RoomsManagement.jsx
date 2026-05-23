import { useState, useEffect } from "react";
import { roomsAPI, adminAPI } from "../../services/api";
import "./Admin.css";

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedRoomForImages, setSelectedRoomForImages] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    capacity: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms();
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", pricePerNight: "", capacity: "" });
    setEditingRoom(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || "",
      pricePerNight: room.price_per_night,
      capacity: room.capacity,
    });
    setShowForm(true);
    setShowImageUpload(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = {
      name: formData.name,
      description: formData.description,
      pricePerNight: parseFloat(formData.pricePerNight),
      capacity: parseInt(formData.capacity),
    };

    try {
      if (editingRoom) {
        await adminAPI.updateRoom(editingRoom.id, data);
        setSuccess("Room updated successfully!");
      } else {
        await adminAPI.createRoom(data);
        setSuccess("Room created successfully!");
      }
      resetForm();
      fetchRooms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (roomId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this room and all its images?"
      )
    )
      return;

    try {
      await adminAPI.deleteRoom(roomId);
      setSuccess("Room deleted successfully!");
      fetchRooms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete room");
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleImageUpload = async (roomId) => {
    if (imageFiles.length === 0) {
      setError("Please select images to upload");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await adminAPI.uploadRoomImages(roomId, formData);
      setSuccess("Images uploaded successfully!");
      setImageFiles([]);
      setImagePreview([]);
      setShowImageUpload(false);
      setSelectedRoomForImages(null);
      fetchRooms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const openImageUpload = (room) => {
    setSelectedRoomForImages(room);
    setShowImageUpload(true);
    setImageFiles([]);
    setImagePreview([]);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Room Management</h2>
          <p className="page-subtitle">
            Manage your property listings and images
          </p>
        </div>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
            setShowImageUpload(false);
          }}
        >
          {showForm ? "Cancel" : "+ Add New Room"}
        </button>
      </div>

      {/* Messages */}
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

      {/* Image Upload Section */}
      {showImageUpload && selectedRoomForImages && (
        <div className="form-card">
          <div className="form-header-with-close">
            <h3 className="form-title">
              Upload Images for {selectedRoomForImages.name}
            </h3>
            <button
              className="close-btn"
              onClick={() => {
                setShowImageUpload(false);
                setSelectedRoomForImages(null);
              }}
            >
              ✕
            </button>
          </div>

          <div className="image-upload-area">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="roomImages"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="file-input"
              />
              <label htmlFor="roomImages" className="file-label">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Choose Images (max 5)
              </label>
            </div>

            {/* Image Previews */}
            {imagePreview.length > 0 && (
              <div className="image-previews">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Current Images */}
            {selectedRoomForImages.images &&
              selectedRoomForImages.images.length > 0 && (
                <div className="current-images-section">
                  <h4>
                    Current Images ({selectedRoomForImages.images.length})
                  </h4>
                  <div className="current-images-grid">
                    {selectedRoomForImages.images.map((img) => (
                      <div key={img.id} className="current-image-item">
                        <img src={img.image_url} alt="Room" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <button
              className="upload-btn"
              onClick={() => handleImageUpload(selectedRoomForImages.id)}
              disabled={uploading || imageFiles.length === 0}
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Room Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Deluxe Ocean Suite"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity (guests)</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerNight">Price per Night ($)</label>
                <input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  placeholder="e.g., 299.00"
                  required
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the room..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {editingRoom ? "Update Room" : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>All Rooms ({rooms.length})</h3>
        </div>

        {rooms.length === 0 ? (
          <div className="empty-state">
            <p>No rooms found. Click "Add New Room" to create one.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Images</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price/Night</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="td-id">#{room.id}</td>
                    <td className="td-images">
                      {room.images && room.images.length > 0 ? (
                        <div className="table-image-preview">
                          <img
                            src={room.images[0].image_url}
                            alt={room.name}
                            className="thumbnail"
                          />
                          {room.images.length > 1 && (
                            <span className="image-count">
                              +{room.images.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="no-image">No images</span>
                      )}
                    </td>
                    <td className="td-name">{room.name}</td>
                    <td className="td-desc">{room.description || "—"}</td>
                    <td className="td-price">
                      ${parseFloat(room.price_per_night).toFixed(2)}
                    </td>
                    <td className="td-capacity">{room.capacity} guests</td>
                    <td className="td-actions">
                      <button
                        className="action-btn image-btn"
                        onClick={() => openImageUpload(room)}
                        title="Upload Images"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
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
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(room)}
                        title="Edit Room"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(room.id)}
                        title="Delete Room"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
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

export default RoomsManagement;
