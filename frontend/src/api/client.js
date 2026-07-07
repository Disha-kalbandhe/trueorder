import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getOrders = () => api.get("/api/orders").then((res) => res.data);
export const getOrderById = (id) =>
  api.get(`/api/orders/${id}`).then((res) => res.data);
export const updateOrderStatus = (id, status) =>
  api.patch(`/api/orders/${id}/status`, { status }).then((res) => res.data);

export default api;
