import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const locationService = {
  /**
   * جلب جميع المحافظات
   */
  getGovernorates: async () => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LOCATION.GOVERNORATES);

      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data?.data?.data)) return response.data.data.data;
      if (Array.isArray(response.data?.governorates)) return response.data.governorates;
      if (Array.isArray(response.data?.data?.governorates)) return response.data.data.governorates;

      return [];
    } catch (error) {
      console.error("Error fetching governorates:", error);
      return [];
    }
  }
};

