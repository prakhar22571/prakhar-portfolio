import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // Generous timeout so a cold-starting backend still resolves instead of
  // dropping the user onto the retry screen.
  timeout: 60000,
});

export default api;
