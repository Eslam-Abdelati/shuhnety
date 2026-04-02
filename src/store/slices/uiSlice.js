import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
    },
});

export const { toggleSidebar, closeSidebar, openSidebar } = uiSlice.actions;
export default uiSlice.reducer;
