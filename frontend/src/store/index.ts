// frontend/src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import preferencesReducer from './slices/preferencesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
});

// Export types for usage in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
