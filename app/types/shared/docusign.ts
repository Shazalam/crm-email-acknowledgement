// Type definitions for request body
export interface LocationInfo {
  country: string;
  region: string;
  city: string;
  zipcode: string;
  ip: string;
  accuracy: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AddressInfo {
  country: string;
  region: string;
  city: string;
  zipcode: string;
  fullAddress: string;
}

export interface BrowserInfo {
  browser: string;
  os: string;
}

export interface DocusignRequestBody {
  sessionId?: string;
  bookingId?: string | null; // ✅ Allow null explicitly
  acknowledged: boolean;
  frontImageBase64?: string;
  backImageBase64?: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: LocationInfo;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  locationPermission: string;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

