// frontend/src/api.js
const rawBackend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const API_URL = (rawBackend.replace(/\/+$/, "")) + "/api";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const text = await res.text();
  let result;
  try { result = text ? JSON.parse(text) : {}; } catch (e) { result = text; }

  if (!res.ok) throw new Error(result?.message || result || "Something went wrong");
  return result;
};
