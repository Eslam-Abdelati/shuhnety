import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, updateUser as updateUserAction } from './slices/authSlice';

export const useAuthStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.auth);

    const store = useMemo(() => ({
        ...state,
        login: (userData, role) => dispatch(loginAction({ userData, role })),
        logout: () => dispatch(logoutAction()),
        updateUser: (data) => dispatch(updateUserAction(data)),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};
