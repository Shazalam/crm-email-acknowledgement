// documentUploadSelectors.ts

import { RootState } from "../../store/store";


export const selectUploadLoading = (state: RootState) =>
  state.documentUpload.loading;
export const selectUploadMessage = (state: RootState) =>
  state.documentUpload.message;
export const selectUploadStep = (state: RootState) =>
  state.documentUpload.currentStep;
export const selectUploadAcknowledged = (state: RootState) =>
  state.documentUpload.acknowledged;

export const selectUploadAckLoading = (state: RootState) =>
  state.documentUpload.ackLoading;
export const selectUploadAckMessage = (state: RootState) =>
  state.documentUpload.ackMessage;
