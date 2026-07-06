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
                notification.isRead = true;
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
        setNotifications: (state, action) => {
            const payload = action.payload;
            // Handle various response shapes, specifically data.notifications
            const notificationsArray = 
                Array.isArray(payload) ? payload :
                Array.isArray(payload?.data?.notifications) ? payload.data.notifications :
                Array.isArray(payload?.data) ? payload.data :
                Array.isArray(payload?.notifications) ? payload.notifications : [];
                
            state.notifications = notificationsArray.map(n => {
                // Determine UI type based on backend type
                let uiType = 'info';
                if (n.type?.includes('accepted') || n.type?.includes('delivered') || n.type?.includes('success')) {
                    uiType = 'success';
                } else if (n.type?.includes('alert') || n.type?.includes('warning')) {
                    uiType = 'warning';
                } else if (n.type?.includes('canceled')) {
                    uiType = 'error';
                }

                const isRead = n.isRead ?? n.is_read ?? (n.status === 'read') ?? false;

                return {
                    id: n.id || n._id,
                    title: n.title || 'إشعار جديد',
                    desc: n.message || n.desc || n.body || n.title,
                    type: uiType,
                    isRead: isRead,
                    active: !isRead,
                    createdAt: n.createDateTime || n.createdAt || n.created_at || new Date().toISOString(),
                    recipientRole: n.recipientRole || null
                };
            });
        }
    },
});

export const { addNotification, markAsRead, clearAll, removeNotification, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

