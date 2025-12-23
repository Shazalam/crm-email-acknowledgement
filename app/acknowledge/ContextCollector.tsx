'use client';

import { useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';
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
  const { locationInfo } = useLocation();

  const ackLoading = useAppSelector(selectUploadAckLoading);
  const ackMessage = useAppSelector(selectUploadAckMessage);

  useEffect(() => {
    if (!locationInfo) return;

    dispatch(
      uploadAcknowledgement({
        acknowledged: true,
        locationInfo,
      })
    );
  }, [dispatch, locationInfo]);

  const statusColor =
    ackLoading ? 'text-emerald-600' : ackMessage ? 'text-emerald-700' : 'text-gray-700';

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100 p-6 sm:p-8">
      {/* Top status row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
          {ackLoading ? (
            <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
          ) : (
            <Shield className="h-5 w-5 text-emerald-600" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Thank You for Acknowledging
          </h2>
          <p className={`text-sm ${statusColor}`}>
            {ackLoading && 'Please wait a moment…'}
            {!ackLoading && ackMessage && ackMessage}
            {!ackLoading && !ackMessage && 'You’re ready to continue to the next step.'}
          </p>
        </div>
      </div>

      {/* Short, neutral note */}
      <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
        <p className="text-xs sm:text-sm text-emerald-800">
          Thank you for confirming that you agree with our terms and service
          process.
        </p>
      </div>
    </div>
  );
}
