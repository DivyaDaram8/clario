const API_URL = "https://clario-backend-y1p1.onrender.com"; // change to deployed URL when hosted

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
  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Something went wrong");

  return result;
};
