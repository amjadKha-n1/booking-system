import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const bookingAPI = {
  createBooking: (data) => api.post("/bookings", data),
};

export const roomsAPI = {
  getRooms: () => api.get("/rooms"),
};

export const paymentAPI = {
  createPayment: (data) => api.post("/payments", data),
};

export const adminAPI = {
  getAllBookings: () => api.get("/admin/all-bookings"),
  createRoom: (data) => api.post("/admin/createRoom", data),
  updateRoom: (id, data) => api.patch(`/admin/updateRoom/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/deleteRoom/${id}`),
  uploadRoomImages: (roomId, formData) =>
    api.post(`/admin/rooms/${roomId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateBookingStatus: (bookingId, status) =>
    api.patch(`/admin/bookings/${bookingId}/status`, { status }),
};

export default api;
