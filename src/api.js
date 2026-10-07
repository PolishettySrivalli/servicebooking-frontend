import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const getServices = () => api.get("/services");
export const getBookings = () => api.get("/bookings");
export const createBooking = (booking) => api.post("/bookings", booking);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

export default api;
