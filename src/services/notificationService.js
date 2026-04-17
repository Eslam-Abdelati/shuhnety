import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const notificationService = {
    /**
     * Get all notifications for the authenticated user
     */
    getUserNotifications: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_USER);
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error('Get user notifications error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل الإشعارات');
        }
    }
};
