import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';
import Cookies from 'js-cookie';

export const authService = {
    /**
     * Upload user image
     * @param {Object} payload { key, prefix, doc }
     */
    uploadImage: async (payload) => {
        try {

            const response = await axiosClient.post(API_ENDPOINTS.AUTH.UPLOAD_IMAGE, payload);
            return response.data;
        } catch (error) {
            console.error('Image upload error details:', error.response?.data || error.message || error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : 'فشل رفع الصورة');
            throw new Error(errorMessage);
        }
    },

    /**
     * Register a new user
     * @param {Object} userData 
     */
    register: async (userData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response.data;
        } catch (error) {
            console.error('Registration error details:', error.response?.data);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : 'حدث خطأ في عملية التسجيل');
            throw new Error(errorMessage);
        }
    },

    /**
     * Verify email with OTP code
     * @param {string} email 
     * @param {string|number} code 
     */
    verifyEmail: async (email, code) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
                email,
                code: Number(code)
            });
            return response.data;
        } catch (error) {
            console.error('Verification error:', error);
            throw new Error(error.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
        }
    },

    /**
     * Login user
     * @param {Object} credentials 
     */
    login: async (credentials) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

            const dataRoot = response.data?.data || response.data;
            const token = dataRoot?.token || dataRoot?.accessToken || dataRoot?.access_token || response.data?.token;
            const user = dataRoot?.user || dataRoot;
            const role = dataRoot?.role || user?.role || response.data?.role;

            if (token) {
                Cookies.set('access_token', token, { expires: 7, path: '/' });
            }

            return {
                ...response.data,
                access_token: token,
                user: user,
                role: role,
                full_name: (user?.full_name || response.data?.full_name || dataRoot?.full_name)
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
        }
    },

    /**
     * Send forgot password code
     * @param {string} email 
     */
    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw new Error(error.response?.data?.message || 'فشل إرسال رمز استعادة كلمة المرور');
        }
    },

    /**
     * Verify reset password code
     * @param {string} email 
     * @param {string|number} code 
     */
    verifyResetCode: async (email, code) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
                email,
                code: Number(code)
            });
            return response.data;
        } catch (error) {
            console.error('Verify reset code error:', error);
            throw new Error(error.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
        }
    },

    /**
     * Reset password
     * @param {Object} resetData { userId, password, confirm_password }
     */
    resetPassword: async (resetData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                userId: Number(resetData.userId),
                password: resetData.password,
                confirm_password: resetData.confirm_password
            });
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : 'فشل إعادة تعيين كلمة المرور');
            throw new Error(errorMessage);
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await axiosClient.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove('access_token');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.USER.PROFILE);
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw new Error(error.response?.data?.message || 'فشل في جلب بيانات الملف الشخصي');
        }
    },

    /**
     * Check if a field value is available (e.g., email or phone)
     * @param {string} field - The field to check (e.g., 'email', 'phone_number')
     * @param {string} value - The value to check
     */
    checkAvailability: async (field, value) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.CHECK_AVAILABILITY, {
                field,
                value
            });
            return response.data;
        } catch (error) {
            console.error('Availability check error:', error);
            const errorMessage = error.response?.data?.message || 'هذه البيانات المستخدمة بالفعل';
            throw new Error(errorMessage);
        }
    },

    /**
     * Resend verification code
     * @param {string} email 
     */
    resendVerificationCode: async (email) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_CODE, { email });
            return response.data;
        } catch (error) {
            console.error('Resend verification code error:', error);
            throw new Error(error.response?.data?.message || 'فشل إعادة إرسال رمز التحقق');
        }
    }
};
