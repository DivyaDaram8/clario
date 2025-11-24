// frontend/src/qotd.js

export const getQuoteOfTheDay = async () => {
  const key = import.meta.env.VITE_API_NINJAS_KEY;

  const res = await fetch("https://api.api-ninjas.com/v2/quoteoftheday", {
    headers: { "X-Api-Key": key }
  });

  if (!res.ok) throw new Error("Failed to fetch Quote of the Day");

  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
};
