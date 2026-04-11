import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const locationService = {
  /**
   * جلب جميع المحافظات
   */
  getGovernorates: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.LOCATION.GOVERNORATES);
    // console.log('Governorates Raw Response:', response.data);

    // استخراج المصفوفة بشكل مرن جداً
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.governorates)) return response.data.governorates;

    return []; // إرجاع مصفوفة فارغة كحمابة بدلاً من undefined
  },

  /**
   * جلب المدن بناءً على معرف المحافظة
   */
  getCities: async (governorateId) => {
    const response = await axiosClient.get(API_ENDPOINTS.LOCATION.CITIES(governorateId));

    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.cities)) return response.data.cities;

    return [];
  }
};

