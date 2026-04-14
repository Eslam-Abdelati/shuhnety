export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_RESET_CODE: '/auth/verify-reset-code',
        RESET_PASSWORD: '/auth/reset-password',
        LOGOUT: '/auth/logOut',
        CHECK_AVAILABILITY: '/auth/check-availability',
        RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
        UPLOAD_IMAGE: '/auth/upload/image',
    },
    USER: {
        PROFILE: '/users/me',
        // In case update profile is needed, often same as /users/me with PUT/PATCH
        UPDATE_PROFILE: '/users/me',
    },
    SHIPMENT: {
        CREATE: '/shipments',
        SEARCH: '/shipments/me/search',
        GET_DETAILS: (id) => `/shipments/${id}`,
        AVAILABLE: '/shipments/available',
        ASSIGNED: '/shipments/assigned',
        UPDATE: (id) => `/shipments/${id}`,
        CANCEL: (id) => `/shipments/${id}/cancel`,
        UPDATE_STATUS: (id) => `/shipments/${id}/status`,
        CONFIRM_DELIVERY: (id) => `/shipments/${id}/confirm-delivery`,
        RATE: (shipmentId) => `/shipments/${shipmentId}/rate`,
        ME_STATS: '/shipments/me/stats',
    },
    BIDS: {
        SUBMIT: '/bids/submit',
        NEW: '/bids/new',
        UPDATE_STATUS: (bidId) => `/bids/${bidId}/status`,
        NEGOTIATE: (bidId) => `/bids/${bidId}/negotiate`,
        DASHBOARD_STATS: '/shipments/driver/dashboard-stats',
    },
    LOCATION: {
        GOVERNORATES: '/governorate/list',
        CITIES: (governorateId) => `/cities/list/${governorateId}`,
    },
    ROAD_ALERTS: {
        CREATE: '/road-alerts',
        GET_ACTIVE: '/road-alerts/active',
        CONFIRM: (id) => `/road-alerts/${id}/confirm`,
    },
};
