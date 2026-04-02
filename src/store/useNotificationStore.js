import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addNotification as addNotificationAction,
    markAsRead as markAsReadAction,
    clearAll as clearAllAction,
    removeNotification as removeNotificationAction
} from './slices/notificationSlice';

export const useNotificationStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.notifications);

    const store = useMemo(() => ({
        ...state,
        addNotification: (notification) => dispatch(addNotificationAction(notification)),
        markAsRead: (id) => dispatch(markAsReadAction(id)),
        clearAll: (role) => dispatch(clearAllAction(role)),
        removeNotification: (id) => dispatch(removeNotificationAction(id)),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};
