import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const notification = action.payload;
            state.notifications.unshift({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: notification.title,
                desc: notification.desc,
                time: 'الآن',
                type: notification.type || 'info',
                active: true,
                recipientRole: notification.recipientRole || null,
                createdAt: new Date().toISOString()
            });
        },
        markAsRead: (state, action) => {
            const id = action.payload;
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
                notification.active = false;
            }
        },
        clearAll: (state, action) => {
            const role = action.payload;
            state.notifications = state.notifications.filter(
                n => n.recipientRole !== role && n.recipientRole !== null
            );
        },
        removeNotification: (state, action) => {
            const id = action.payload;
            state.notifications = state.notifications.filter(n => n.id !== id);
        },
    },
});

export const { addNotification, markAsRead, clearAll, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

