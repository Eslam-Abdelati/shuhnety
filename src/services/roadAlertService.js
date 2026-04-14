import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const roadAlertService = {
    /**
     * Create a new road alert
     * @param {Object} alertData - { type, locationText }
     */
    createRoadAlert: async (alertData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.ROAD_ALERTS.CREATE, alertData);
            return response.data;
        } catch (error) {
            console.error('Create road alert error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'فشل في إرسال تنبيه الطريق';
            throw new Error(errorMessage);
        }
    },
    /**
     * Get all active road alerts
     */
    getActiveAlerts: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.ROAD_ALERTS.GET_ACTIVE);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Get active road alerts error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في جلب تنبيهات الطريق');
        }
    },
    /**
     * Confirm a road alert
     * @param {string} id - The alert ID
     */
    confirmRoadAlert: async (id) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.ROAD_ALERTS.CONFIRM(id));
            return response.data;
        } catch (error) {
            console.error('Confirm road alert error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تأكيد التنبيه');
        }
    }
};

