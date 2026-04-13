import axios from "axios";
import Cookies from "js-cookie";

// في بيئة التطوير نستخدم الرابط المباشر من .env
// وفي الإنتاج (Netlify) نستخدم /api الذي يتم تحويله عبر _redirects لتجنب الـ CORS
const isDevelopment = import.meta.env.MODE === 'development';
const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // تجاوز صفحة ngrok
  if (!isDevelopment) {
    config.headers['ngrok-skip-browser-warning'] = 'true';
  } else if (API_BASE_URL && API_BASE_URL.includes('ngrok')) {
    config.params = config.params || {};
    config.params['ngrok-skip-browser-warning'] = 'true';
  }

  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        // Clear all persistence to prevent redirection loops
        Cookies.remove("access_token", { path: '/' });
        Cookies.remove("role", { path: '/' });
        localStorage.clear(); // Important: clears redux-persist state
        
        // Also try removing without path just in case
        Cookies.remove("access_token");
        Cookies.remove("role");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default axiosClient;

