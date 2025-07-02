import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import themeReducer from '../features/themeSlice.js';
import authReducer  from '../features/authSlice.js';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'auth']
};

const rootReducer = combineReducers({
  theme: themeReducer,
  auth : authReducer
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);
