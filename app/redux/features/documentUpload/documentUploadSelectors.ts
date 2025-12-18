import { RootState } from "../../store/store";


export const selectDocumentUploadState = (state: RootState) => state.documentUpload;
export const selectUploadLoading = (state: RootState) => state.documentUpload.loading;
export const selectUploadMessage = (state: RootState) => state.documentUpload.message;
export const selectUploadStep = (state: RootState) => state.documentUpload.currentStep;
export const selectUploadAcknowledged = (state: RootState) => state.documentUpload.acknowledged;
