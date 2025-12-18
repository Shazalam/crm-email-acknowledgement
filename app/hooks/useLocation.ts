'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAccurateIP, getAddressFromCoords } from '@/lib/utils/frontend/documentUploadForm';
import { LocationInfo } from '../types/shared/docusign';

type LocationPermission = 'granted' | 'denied' | 'prompt';

const INITIAL_LOCATION: LocationInfo = {
  country: 'Detecting...',
  region: 'Detecting...',
  city: 'Detecting...',
  zipcode: 'Detecting...',
  ip: 'Detecting...',
  accuracy: 'Initializing...',
  fullAddress: 'Detecting your location...'
};

export function useLocation() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(INITIAL_LOCATION);
  const [permission, setPermission] = useState<LocationPermission>('prompt');
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 1️⃣ Fetch IP-based location (no permission required)
   */
  const fetchIpLocation = useCallback(async () => {
    try {
      const ip = await getAccurateIP();

      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();

      setLocationInfo({
        country: data.country_name || 'Unknown',
        region: data.region || data.region_code || 'Unknown',
        city: data.city || 'Unknown',
        zipcode: data.postal || data.postal_code || 'Unknown',
        ip,
        accuracy: 'IP-based (approximate)',
        fullAddress:
          `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.trim() ||
          'Address not available',
        coordinates:{
          lat: data.latitude || 0,
          lng: data.longitude || 0
        }
      });
    } catch {
      setLocationInfo(prev => ({
        ...prev,
        ip: 'Unknown',
        accuracy: 'IP detection failed'
      }));
    }
  }, []);

  /**
   * 2️⃣ Fetch GPS-based location (permission required)
   */
  const fetchGpsLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermission('denied');
      setLocationInfo(prev => ({
        ...prev,
        accuracy: 'GPS not supported',
        fullAddress: 'Browser does not support GPS'
      }));
      return;
    }

    if (!window.isSecureContext) {
      setPermission('denied');
      setLocationInfo(prev => ({
        ...prev,
        accuracy: 'GPS requires HTTPS',
        fullAddress: 'GPS requires secure HTTPS connection'
      }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        })
      );

      const { latitude, longitude, accuracy } = position.coords;

      const address = await getAddressFromCoords(latitude, longitude);
      const ip = await getAccurateIP();

      setLocationInfo({
        country: address.country,
        region: address.region,
        city: address.city,
        zipcode: address.zipcode,
        ip,
        accuracy: `GPS (${Math.round(accuracy)}m accuracy)`,
        fullAddress: address.fullAddress,
        coordinates: { lat: latitude, lng: longitude },
      });

      setPermission('granted');
    } catch (error: unknown) {
      const err = error as GeolocationPositionError;

      setPermission('denied');

      let reason = 'GPS unavailable';
      if (err.code === 1) reason = 'Permission denied by user';
      if (err.code === 2) reason = 'Position unavailable';
      if (err.code === 3) reason = 'GPS timeout';

      setLocationInfo(prev => ({
        ...prev,
        accuracy: `GPS failed (${reason})`,
        fullAddress: 'Using IP-based location'
      }));
    }
  }, []);

  /**
   * 3️⃣ Public method: request GPS permission manually
   */
  const requestPermission = useCallback(async () => {
    setPermission('prompt');
    await fetchGpsLocation();
  }, [fetchGpsLocation]);

  /**
   * 4️⃣ Initialize on mount
   */
  useEffect(() => {
    (async () => {
      await fetchIpLocation();
      await fetchGpsLocation();
      setLoading(false);
    })();
  }, [fetchIpLocation, fetchGpsLocation]);

  return {
    locationInfo,
    permission,
    loading,
    requestPermission
  };
}