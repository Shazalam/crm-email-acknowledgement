'use client';

import { useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { uploadAcknowledgement } from '../redux/features/documentUpload/documentUploadThunks';
import {
  selectUploadAckLoading,
  selectUploadAckMessage,
} from '../redux/features/documentUpload/documentUploadSelectors';

export default function ContextCollector() {
  const dispatch = useAppDispatch();

  const {
    locationInfo,
  } = useLocation();

  const ackLoading = useAppSelector(selectUploadAckLoading);
  const ackMessage = useAppSelector(selectUploadAckMessage);

  // Auto-acknowledge with device/location when location is ready
  useEffect(() => {
    if (!locationInfo) return;

    dispatch(
      uploadAcknowledgement({
        acknowledged: true,
        locationInfo,
      })
    );
  }, [dispatch, locationInfo]);

  return (
    <div className="max-w-md bg-white p-6 rounded-2xl shadow mb-4">
      <h1 className="text-xl font-semibold mb-3">
        Verification Initialization
      </h1>

      {ackLoading && (
        <p className="text-sm text-gray-600">
          Collecting verification details…
        </p>
      )}

      {!ackLoading && ackMessage && (
        <p className="text-sm text-gray-700">
          {ackMessage}
        </p>
      )}

      {!ackLoading && !ackMessage && (
        <p className="text-sm text-gray-700">
          Device and location details recorded for verification.
        </p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Your device, browser, IP, and location information are collected only for
        verification and fraud prevention.
      </p>
    </div>
  );
}
