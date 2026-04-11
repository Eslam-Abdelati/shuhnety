import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import shipmentReducer from './slices/shipmentSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import offerReducer from './slices/offerSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    shipments: shipmentReducer,
    theme: themeReducer,
    ui: uiReducer,
    offers: offerReducer,
    notifications: notificationReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['notifications', 'auth', 'theme'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

