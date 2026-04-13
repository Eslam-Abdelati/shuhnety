import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mapShipmentData } from '../utils/shipmentUtils';

export const shipmentService = {
    /**
     * Create a new shipment
     * @param {Object} shipmentData
     */
    createShipment: async (shipmentData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.SHIPMENT.CREATE, shipmentData);
            const result = response.data;
            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            }
            return result;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('Create shipment error data:', errorData || error.message);

            const errorMessage = errorData?.message ||
                (errorData?.errors ? Object.values(errorData.errors).flat().join(', ') : 'فشل في إنشاء الشحنة');
            throw new Error(errorMessage);
        }
    },
    /**
     * Search for shipments for the current user
     * @param {Object} params - Query params (skip, take)
     * @param {Object} body - Search and status
     */
    searchShipments: async (params = { skip: 0, take: 10 }, body = {}) => {
        try {
            // Clean up body: only send fields if they have non-empty values
            const cleanedBody = {};
            if (body.search?.trim()) cleanedBody.search = body.search.trim();
            if (body.status && body.status !== 'all' && body.status !== 'الكل') {
                cleanedBody.status = body.status;
            }

            const response = await axiosClient.post(API_ENDPOINTS.SHIPMENT.SEARCH, cleanedBody, { params });
            const result = response.data;

            // Automatically map the shipments if they exist in the response
            if (result.status && result.data?.shipments) {
                result.data.shipments = result.data.shipments.map(mapShipmentData);
            } else if (Array.isArray(result.data)) {
                // Fallback for different response shapes
                result.data = result.data.map(mapShipmentData);
            }

            // console.log('Processed Shipments:', result);
            return result;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('Search shipments error:', errorData || error.message);
            throw new Error(errorData?.message || 'فشل في تحميل الشحنات');
        }
    },
    /**
     * Get shipment by ID
     * @param {string|number} id
     */
    getShipmentById: async (id) => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.SHIPMENT.GET_DETAILS(id));
            const result = response.data;

            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            } else if (result.id || result._id) {
                const mapped = mapShipmentData(result);
                return mapped;
            }

            return result.data || result;
        } catch (error) {
            console.error('[shipmentService] Get shipment by ID error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل تفاصيل الشحنة');
        }
    },
    /**
     * Search for available shipments (for drivers)
     * @param {Object} params - Query params (skip, take)
     */
    searchAvailableShipments: async (params = { skip: 0, take: 10 }) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.SHIPMENT.AVAILABLE, {}, { params });
            const result = response.data;

            // Automatically map the shipments
            if (result.status && result.data?.shipments) {
                result.data.shipments = result.data.shipments.map(mapShipmentData);
            } else if (Array.isArray(result.data)) {
                result.data = result.data.map(mapShipmentData);
            }

            return result;
        } catch (error) {
            console.error('Search available shipments error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل الشحنات المتاحة');
        }
    },
    /**
     * Get shipments assigned to the logged-in driver
     * @param {Object} params - Query params (skip, take)
     */
    getAssignedShipments: async (params = { skip: 0, take: 10 }) => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.SHIPMENT.ASSIGNED, { params });
            const result = response.data;
            // Automatically map the shipments
            if (result.status && result.data?.shipments) {
                result.data.shipments = result.data.shipments.map(mapShipmentData);
            } else if (Array.isArray(result.data)) {
                result.data = result.data.map(mapShipmentData);
            }

            return result;
        } catch (error) {
            console.error('Get assigned shipments error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل الشحنات الموكلة إليك');
        }
    },
    /**
     * Update an existing shipment
     * @param {string|number} id
     * @param {Object} shipmentData
     */
    updateShipment: async (id, shipmentData) => {
        try {
            const response = await axiosClient.put(API_ENDPOINTS.SHIPMENT.UPDATE(id), shipmentData);
            const result = response.data;
            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            }
            return result;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('Update shipment error:', errorData || error.message);
            const errorMessage = errorData?.message || 'فشل في تحديث الشحنة';
            throw new Error(errorMessage);
        }
    },
    /**
     * Cancel a shipment
     * @param {string|number} id
     */
    cancelShipment: async (id) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.SHIPMENT.CANCEL(id));
            const result = response.data;
            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            }
            return result;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('Cancel shipment error:', errorData || error.message);
            const errorMessage = errorData?.message || 'فشل في إلغاء الشحنة';
            throw new Error(errorMessage);
        }
    },
    /**
     * Get shipment statistics for current user
     */
    getShipmentStats: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.SHIPMENT.ME_STATS);
            return response.data;
        } catch (error) {
            console.error('Get shipment stats error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل إحصائيات الشحنات');
        }
    },

    async submitBid(bidData) {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.BIDS.SUBMIT, bidData);
            return response.data;
        } catch (error) {
            console.error('Submit bid error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تقديم العرض');
        }
    },

    /**
     * Accept or reject a bid
     * @param {number|string} bidId 
     * @param {string} status - 'accepted' or 'rejected'
     */
    updateBidStatus: async (bidId, status) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.BIDS.UPDATE_STATUS(bidId), { status });
            return response.data;
        } catch (error) {
            console.error('Update bid status error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحديث حالة العرض');
        }
    },

    /**
     * Negotiate a bid (customer counter-offer)
     * @param {number|string} bidId 
     * @param {number} amount 
     */
    negotiateBid: async (bidId, amount) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.BIDS.NEGOTIATE(bidId),
                { new_amount: Number(amount) },
                { headers: { 'Accept': '*/*' } }
            );
            return response.data;
        } catch (error) {
            console.error('❌ Negotiate bid error:', error.response?.data || error.message);
            const serverMessage = error.response?.data?.message || 'فشل في إرسال عرض التفاوض';
            throw new Error(serverMessage);
        }
    },

    /**
     * Update shipment status (for drivers)
     * @param {string|number} id
     * @param {string} status
     */
    updateShipmentStatus: async (id, status) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.SHIPMENT.UPDATE_STATUS(id), { status });
            const result = response.data;
            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            }
            return result;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('Update status error:', errorData || error.message);
            const serverMessage = errorData?.message || 'فشل في تحديث حالة الشحنة';
            throw new Error(serverMessage);
        }
    },

    /**
     * Confirm shipment delivery (usually for drivers)
     * @param {string|number} id
     */
    confirmDelivery: async (id) => {
        try {
            const response = await axiosClient.patch(API_ENDPOINTS.SHIPMENT.CONFIRM_DELIVERY(id));
            const result = response.data;
            if (result.status && result.data) {
                result.data = mapShipmentData(result.data);
            }
            return result;
        } catch (error) {
            console.error('Confirm delivery error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تأكيد التوصيل');
        }
    },
    /**
     * Submit a review for a completed shipment
     * @param {string|number} shipmentId
     * @param {Object} reviewData - { rating, comment }
     */
    submitReview: async (shipmentId, reviewData) => {
        try {
            // Note: Updated review endpoint if it changes in backend, but keeping current if not listed
            const response = await axiosClient.post(`/shipments/${shipmentId}/review`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Submit review error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في إرسال التقيم');
        }
    },
    /**
     * Get new bids for the logged-in customer
     */
    getNewBids: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.BIDS.NEW);
            return response.data;
        } catch (error) {
            console.error('Get new bids error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل العروض الجديدة');
        }
    },
    /**
     * Get bidding dashboard statistics
     */
    getBidDashboardStats: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.BIDS.DASHBOARD_STATS);
            return response.data;
        } catch (error) {
            console.error('Get bid dashboard stats error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'فشل في تحميل إحصائيات المزايدات');
        }
    }
};

