'use client';

import { useEffect } from 'react';
import {Loader2, MapPin, Shield, Smartphone } from 'lucide-react';
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
            Initial Security Check
          </h2>
          <p className={`text-sm ${statusColor}`}>
            {ackLoading && 'Collecting device and location details…'}
            {!ackLoading && ackMessage && ackMessage}
            {!ackLoading && !ackMessage &&
              'Device and location details recorded for verification.'}
          </p>
        </div>
      </div>
      {/* Footer note */}
      <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
        <p className="text-xs sm:text-sm text-emerald-800">
          This step runs automatically and usually completes in a few seconds.
          Once finished, you can safely proceed to upload your documents on the
          next screen.
        </p>
      </div>
    </div>
  );
}
