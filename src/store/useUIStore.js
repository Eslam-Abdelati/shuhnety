import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar as toggleSidebarAction, closeSidebar as closeSidebarAction, openSidebar as openSidebarAction } from './slices/uiSlice';

export const useUIStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.ui);

    const store = useMemo(() => ({
        ...state,
        toggleSidebar: () => dispatch(toggleSidebarAction()),
        closeSidebar: () => dispatch(closeSidebarAction()),
        openSidebar: () => dispatch(openSidebarAction()),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};

