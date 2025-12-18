'use client';

import { useEffect, useState } from 'react';
import {
  getAccurateIP,
  getAccurateBrowserInfo,
  getAddressFromCoords
} from '@/lib/utils/frontend/documentUploadForm';

export default function ContextCollector() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const collectContext = async () => {
      try {
        const browserInfo = await getAccurateBrowserInfo();
        const ip = await getAccurateIP();

        let location = {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          zipcode: 'Unknown',
          accuracy: 'IP-based',
          fullAddress: 'Unavailable'
        };

        // Silent GPS attempt
        if (navigator.geolocation && window.isSecureContext) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
              })
            );

            const address = await getAddressFromCoords(
              position.coords.latitude,
              position.coords.longitude
            );

            location = {
              ...address,
              accuracy: `GPS (${Math.round(position.coords.accuracy)}m)`
            };
          } catch {
            // fallback silently
          }
        }

        const payload = {
          device: /Mobi|Android|iPhone/i.test(navigator.userAgent)
            ? 'mobile'
            : 'desktop',
          browser: browserInfo.browser,
          os: browserInfo.os,
          ip,
          location,
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        };

        const res = await fetch('/api/verification/context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.ok) {
          localStorage.setItem('verificationContextId', data.contextId);
          setMessage('Verification details collected successfully.');
        } else {
          setMessage('Failed to collect verification details.');
        }
      } catch {
        setMessage('Something went wrong while collecting verification details.');
      } finally {
        setLoading(false);
      }
    };

    collectContext();
  }, []);

  return (
    <div className="max-w-md bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-3">
        Verification Initialization
      </h1>

      {loading && <p>Collecting verification details…</p>}

      {message && (
        <p className="text-sm text-gray-700 mb-4">{message}</p>
      )}

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />
        <span className="text-sm">
          I acknowledge that my device and location information is collected
          for verification.
        </span>
      </label>

      <button
        disabled={!acknowledged}
        onClick={() => (window.location.href = '/verify/documents')}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg disabled:bg-gray-300"
      >
        Continue to Upload Documents
      </button>
    </div>
  );
}
