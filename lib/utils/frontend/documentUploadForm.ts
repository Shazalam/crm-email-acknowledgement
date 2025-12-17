
import { AddressInfo, BrowserInfo } from '../../../app/types/shared/docusign';

// Utility Functions
export async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    throw new Error("Network timeout or failed request");
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

export const getAccurateBrowserInfo = async (): Promise<BrowserInfo> => {
  const ua = navigator.userAgent;
  let fullBrowser = "Unknown Browser";
  let os = "Unknown OS";

  try {
    if (navigator.brave && (await navigator.brave.isBrave())) {
      fullBrowser = "Brave (version hidden)";
    } else {
      const browserPatterns = [
        { pattern: /Vivaldi\/([\d.]+)/, name: "Vivaldi" },
        { pattern: /Edg\/([\d.]+)/, name: "Edge" },
        { pattern: /Trident\/.*rv:([\d.]+)/, name: "Internet Explorer" },
        { pattern: /Firefox\/([\d.]+)/, name: "Firefox" },
        { pattern: /OPR\/([\d.]+)/, name: "Opera" },
        { pattern: /Opera.*Version\/([\d.]+)/, name: "Opera" },
        { pattern: /Chrome\/([\d.]+)/, name: "Chrome" },
        { pattern: /Version\/([\d.]+).*Safari/, name: "Safari" },
        { pattern: /Safari\/([\d.]+)/, name: "Safari" },
      ];

      for (const { pattern, name } of browserPatterns) {
        const match = ua.match(pattern);
        if (match) {
          // ✅ FIX #1: Use match[1] to get the captured version number
          fullBrowser = `${name} ${match[1]}`;
          break;
        }
      }
    }

    if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
    else if (ua.includes("Windows NT 6.2")) os = "Windows 8";
    else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
    else if (ua.includes("Windows NT 6.0")) os = "Windows Vista";
    else if (ua.includes("Windows NT 5.1")) os = "Windows XP";
    else if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) {
      const versionMatch = ua.match(/Mac OS X ([0-9_]+)/);
      // ✅ FIX #1: Use versionMatch[1] to get the version, not the entire match array
      os = versionMatch ? `macOS ${versionMatch[1].replace(/_/g, ".")}` : "macOS";
    } else if (ua.includes("Android")) {
      const versionMatch = ua.match(/Android ([0-9.]+)/);
      // ✅ FIX #1: Use versionMatch[1] to get the version
      os = versionMatch ? `Android ${versionMatch[1]}` : "Android";
    } else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iOS")) {
      const versionMatch = ua.match(/OS ([0-9_]+)/);
      // ✅ FIX #1: Use versionMatch[1] to get the version, not the entire match array
      os = versionMatch ? `iOS ${versionMatch[1].replace(/_/g, ".")}` : "iOS";
    } else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("X11")) os = "Unix";
  } catch {
    console.warn("Error detecting browser info");
  }

  return { browser: fullBrowser, os };
};

export async function getAddressFromCoords(lat: number, lng: number): Promise<AddressInfo> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    if (data?.address) {
      return {
        country: data.address.country || 'Unknown',
        region: data.address.state || data.address.region || 'Unknown',
        city: data.address.city || data.address.town || data.address.village || 'Unknown',
        zipcode: data.address.postcode || 'Unknown',
        fullAddress: data.display_name || 'Unknown'
      };
    }

    throw new Error('No address data received');
  } catch {
    console.error('Reverse geocoding error');

    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();

      return {
        country: ipData.country_name || 'Unknown',
        region: ipData.region || ipData.region_code || 'Unknown',
        city: ipData.city || 'Unknown',
        zipcode: ipData.postal || ipData.postal_code || 'Unknown',
        fullAddress: `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country_name || ''}`.trim()
      };
    } catch {
      console.error('IP-based location also failed');
    }

    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      zipcode: 'Unknown',
      fullAddress: 'Location detection failed'
    };
  }
}

export async function getAccurateIP(): Promise<string> {
  try {
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://ip.seeip.org/json'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          const data = await response.json();
          if (data.ip) return data.ip;
        }
      } catch {
        console.warn(`IP service ${service} failed`);
        continue;
      }
    }

    return 'Unknown';
  } catch {
    console.error('All IP services failed');
    return 'Unknown';
  }
}