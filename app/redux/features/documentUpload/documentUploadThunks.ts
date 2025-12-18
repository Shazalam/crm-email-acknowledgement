'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithTimeout, fileToBase64, getAccurateBrowserInfo } from '@/lib/utils/frontend/documentUploadForm';
import { LocationInfo } from '@/app/types/shared/docusign';


interface UploadDocumentsArgs {
  frontFile: File | null;
  backFile: File | null;
  acknowledged: boolean;
  permission: PermissionState | 'unknown';
  locationInfo: LocationInfo;
}

interface UploadDocumentsResponse {
  customerId: string;
  // verificationStatus: string;
}

interface RejectedValue {
  message: string;
}

export const uploadDocuments = createAsyncThunk<
  UploadDocumentsResponse,
  UploadDocumentsArgs,
  { rejectValue: RejectedValue }
>(
  'documentUpload/uploadDocuments',
  async (args, { rejectWithValue }) => {
    const { frontFile, backFile, 
      acknowledged,
       permission, locationInfo } = args;

    try {
      if (!acknowledged) {
        return rejectWithValue({
          message: '⚠️ Please confirm acknowledgment before submitting.',
        });
      }

      if (!frontFile && !backFile) {
        return rejectWithValue({
          message: 'Please upload at least one photo (front or back).',
        });
      }

      const browserInfo = await getAccurateBrowserInfo();

      const [frontBase64, backBase64] = await Promise.all([
        frontFile ? fileToBase64(frontFile) : Promise.resolve(null),
        backFile ? fileToBase64(backFile) : Promise.resolve(null),
      ]);

      const urlParams = new URLSearchParams(window.location.search);
      const bookingId = urlParams.get('bookingId');

      const payload = {
        bookingId,
        acknowledged,
        frontImageBase64: frontBase64,
        backImageBase64: backBase64,
        device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
          ? 'mobile'
          : 'desktop',
        browser: browserInfo.browser || 'Unknown Browser',
        os: browserInfo.os || 'Unknown OS',
        ip: locationInfo?.ip || 'Unknown',
        location: {
          country: locationInfo.country,
          region: locationInfo.region,
          city: locationInfo.city,
          zipcode: locationInfo.zipcode,
          accuracy: locationInfo.accuracy,
          fullAddress: locationInfo.fullAddress,
          coordinates: locationInfo.coordinates,
        },
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      console.log("upload Documents =>", payload)
      const res = await fetchWithTimeout('/api/docusign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Your backend returns ApiResponse<T> shape:
      // { status: 'success' | 'error', message, data, error, meta }
      if (res.ok && data.status === 'success') {
        return {
          customerId: data.data.customerId,
          // verificationStatus: data.data.verificationStatus,
        };
      }

      return rejectWithValue({
        message: `Upload failed: ${data.message || 'Please try again.'}`,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unexpected error';
      return rejectWithValue({
        message: `Upload error: ${errorMessage}. Please try again.`,
      });
    }
  }
);
