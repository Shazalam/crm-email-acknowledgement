import { LocationInfo } from "@/app/types/shared/docusign";

export function normalizeLocation(location: any): LocationInfo {
  return {
    country: location?.country ?? 'Unknown',
    region: location?.region ?? 'Unknown',
    city: location?.city ?? 'Unknown',
    zipcode: location?.zipcode ?? 'Unknown',
    accuracy: location?.accuracy ?? 'Unknown',
    fullAddress: location?.fullAddress ?? 'Unknown',
    coordinates: location?.coordinates
      ? {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        }
      : undefined,
  };
}
