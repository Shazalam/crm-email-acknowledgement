'use client';

import { configureStore } from '@reduxjs/toolkit';
import  documentUploadReducer from '../features/documentUpload/documentUploadSlice';

export const store = configureStore({
  reducer: {
    documentUpload: documentUploadReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
