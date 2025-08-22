const API_URL = "http://localhost:5000/api"; // change to deployed URL when hosted

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

// -------------------------
// 📝 Journal API Helpers
// -------------------------

// Get journal by date (ex: "2025-08-22")
export const getJournalByDate = (date) =>
  apiRequest(`/journals/${date}`, "GET");

// Save or update a journal entry
export const saveJournal = (date, content) =>
  apiRequest(`/journals/${date}`, "POST", { content });
