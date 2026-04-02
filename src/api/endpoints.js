export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    UPLOAD_IMAGE: "/auth/upload/image",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_CODE: "/auth/verify-reset-code",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logOut",
    CHECK_AVAILABILITY: "/auth/check-availability",
    RESEND_VERIFICATION_CODE: "/auth/resend-verification-code",
  },

  USER: {
    PROFILE: "/users/me",
  },

  LOCATION: {
    GOVERNORATES: "/governorate/list",
    CITIES: (id) => `/cities/list/${id}`,
  },

  SHIPMENT: {
    CREATE: "/shipments",
    SEARCH: "/shipments/me/search",
    AVAILABLE: "/shipments/available",
    ASSIGNED: "/shipments/assigned",
    GET_DETAILS: (id) => `/shipments/${id}`,
    UPDATE: (id) => `/shipments/${id}`,
    CANCEL: (id) => `/shipments/${id}/cancel`,
    UPDATE_STATUS: (id) => `/shipments/${id}/status`,
    ME_STATS: "/shipments/me/stats",
  },

  BIDS: {
    SUBMIT: "/bids/submit",
    UPDATE_STATUS: (id) => `/bids/${id}/status`,
    NEGOTIATE: (id) => `/bids/${id}/negotiate`,
    NEW: "/bids/new",
  },

};
