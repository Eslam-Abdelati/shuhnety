import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    user: null,
    token: Cookies.get('access_token') || null,
    // Internal mapping: if cookie role is 'client', treat as 'customer' for UI logic
    role: Cookies.get('role')
        ? (decodeURIComponent(Cookies.get('role')) === 'client' ? 'customer' : decodeURIComponent(Cookies.get('role')))
        : null,
    isAuthenticated: !!Cookies.get('access_token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { userData, role: uiRole } = action.payload;

            const actualUserData = userData.data || userData;
            state.user = { ...actualUserData };

            state.role = uiRole;
            state.isAuthenticated = true;
            state.token = actualUserData.access_token || userData.access_token || actualUserData.token || userData.token;

            // Save to Cookies ONLY essential auth data
            Cookies.set('access_token', state.token, { expires: 7, path: '/' });
            Cookies.set('role', encodeURIComponent(actualUserData.role || userData.role || uiRole), { expires: 7, path: '/' });
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            state.token = null;

            // Remove ONLY essential keys from Cookies
            Cookies.remove('access_token');
            Cookies.remove('role');

            // Clear localStorage
            localStorage.clear();
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
