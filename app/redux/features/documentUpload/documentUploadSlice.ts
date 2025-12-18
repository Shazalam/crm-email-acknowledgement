'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uploadDocuments } from './documentUploadThunks';

type MessageType = 'success' | 'error';

interface DocumentUploadMessage {
  text: string;
  type: MessageType;
}

type StepType = 'upload' | 'complete';

interface DocumentUploadState {
  loading: boolean;
  message: DocumentUploadMessage | null;
  currentStep: StepType;
  acknowledged: boolean;
  customerId: string | null;
  verificationStatus: string | null;
}

const initialState: DocumentUploadState = {
  loading: false,
  message: null,
  currentStep: 'upload',
  acknowledged: true,
  customerId: null,
  verificationStatus: null,
};

const documentUploadSlice = createSlice({
  name: 'documentUpload',
  initialState,
  reducers: {
    setAcknowledged(state, action: PayloadAction<boolean>) {
      state.acknowledged = action.payload;
    },
    resetUploadState() {
      return initialState;
    },
    clearMessage(state) {
      state.message = null;
    },
    setMessage(state, action: PayloadAction<DocumentUploadMessage>) {
      state.message = action.payload;
    },
    setStep(state, action: PayloadAction<StepType>) {
      state.currentStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.customerId = action.payload.customerId;
        // state.verificationStatus = action.payload.verificationStatus;
        state.currentStep = 'complete';
        state.message = {
          text: '✅ Thanks! Your documents & acknowledgment have been received.',
          type: 'success',
        };
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.message = {
          text:
            action.payload?.message ||
            'Upload error: Unexpected error. Please try again.',
          type: 'error',
        };
      });
  },
});

export const {
  setAcknowledged,
  resetUploadState,
  clearMessage,
  setMessage,
  setStep,
} = documentUploadSlice.actions;

export default documentUploadSlice.reducer;
