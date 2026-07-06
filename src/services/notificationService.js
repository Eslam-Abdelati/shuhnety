import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const notificationService = {
    /**
     * Get all notifications for the authenticated user
     */
    getUserNotifications: async (isRead = null) => {
        try {
            const params = isRead !== null ? { isRead } : {};
            const response = await axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_USER, { params });
            return response.data;

        } catch (error) {
            console.error('Get user notifications error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل الإشعارات');
        }
    },

    /**
     * Mark a specific notification as read
     */
    markAsRead: async (id) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
            return response.data;
        } catch (error) {
            console.error('Mark notification as read error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحديث حالة الإشعار');
        }
    }
};
