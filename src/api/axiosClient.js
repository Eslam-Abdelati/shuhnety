import axios from "axios";
import Cookies from "js-cookie";

// في بيئة التطوير نستخدم الرابط المباشر من .env
// وفي الإنتاج (Netlify) نستخدم /api الذي يتم تحويله عبر _redirects لتجنب الـ CORS
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? import.meta.env.VITE_API_URL : '/api';

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
      // DON'T clear if we are ON the login page already
      if (!window.location.pathname.includes('/login')) {
        Cookies.remove("access_token", { path: '/' });
        Cookies.remove("role", { path: '/' });
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default axiosClient;
