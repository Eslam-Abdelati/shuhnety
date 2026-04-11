import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggleThemeAction, setTheme as setThemeAction } from './slices/themeSlice';

export const useThemeStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.theme);

    const store = useMemo(() => ({
        ...state,
        toggleTheme: () => dispatch(toggleThemeAction()),
        setTheme: (theme) => dispatch(setThemeAction(theme)),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};

