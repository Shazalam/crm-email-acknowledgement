'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uploadDocuments, uploadAcknowledgement } from './documentUploadThunks';

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
  ackLoading: boolean;
  ackMessage: string | null;
}

const initialState: DocumentUploadState = {
  loading: false,
  message: null,
  currentStep: 'upload',
  acknowledged: true,
  customerId: null,
  verificationStatus: null,
  ackLoading: false,
  ackMessage: null,
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
    // documents upload
    builder
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.customerId = action.payload.customerId;
        state.currentStep = 'complete';
        state.message = {
          text:
            '✅ Thanks! Your documents & acknowledgment have been received.',
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

    // acknowledgement only
    builder
      .addCase(uploadAcknowledgement.pending, (state) => {
        state.ackLoading = true;
        state.ackMessage = null;
      })
      .addCase(uploadAcknowledgement.fulfilled, (state) => {
        state.ackLoading = false;
        state.ackMessage = 'Acknowledgement saved successfully.';
      })
      .addCase(uploadAcknowledgement.rejected, (state, action) => {
        state.ackLoading = false;
        state.ackMessage =
          action.payload?.message ||
          'Failed to save acknowledgement. Please try again.';
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
