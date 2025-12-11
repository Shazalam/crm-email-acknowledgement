
// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import {
//   Upload,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   Camera,
//   Loader2
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import imageCompression from 'browser-image-compression';

// // Enhanced fetch with timeout
// async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 15000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//   try {
//     const response = await fetch(resource, { ...options, signal: controller.signal });
//     clearTimeout(id);
//     return response;
//   } catch {
//     clearTimeout(id);
//     throw new Error("Network timeout or failed request");
//   }
// }

// // Improved file to base64 conversion
// function fileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (typeof reader.result === 'string') {
//         resolve(reader.result);
//       } else {
//         reject(new Error('Failed to convert file to base64'));
//       }
//     };
//     reader.onerror = () => reject(new Error('File reading failed'));
//     reader.readAsDataURL(file);
//   });
// }

// // Navigator extension for Brave detection
// declare global {
//   interface Navigator {
//     brave?: {
//       isBrave: () => Promise<boolean>;
//     };
//   }
// }

// // Enhanced browser and OS detection
// export const getAccurateBrowserInfo = async (): Promise<{ browser: string; os: string }> => {
//   const ua = navigator.userAgent;
//   let fullBrowser = "Unknown Browser";
//   let os = "Unknown OS";

//   try {
//     // Detect Brave (even when hiding userAgent)
//     if (navigator.brave && (await navigator.brave.isBrave())) {
//       fullBrowser = "Brave (version hidden)";
//     } else {
//       // Detect Browser + Version with precise patterns
//       const browserPatterns = [
//         { pattern: /Vivaldi\/([\d.]+)/, name: "Vivaldi" },
//         { pattern: /Edg\/([\d.]+)/, name: "Edge" },
//         { pattern: /Trident\/.*rv:([\d.]+)/, name: "Internet Explorer" },
//         { pattern: /Firefox\/([\d.]+)/, name: "Firefox" },
//         { pattern: /OPR\/([\d.]+)/, name: "Opera" },
//         { pattern: /Opera.*Version\/([\d.]+)/, name: "Opera" },
//         { pattern: /Chrome\/([\d.]+)/, name: "Chrome" },
//         { pattern: /Version\/([\d.]+).*Safari/, name: "Safari" },
//         { pattern: /Safari\/([\d.]+)/, name: "Safari" },
//       ];

//       for (const { pattern, name } of browserPatterns) {
//         const match = ua.match(pattern);
//         if (match) {
//           fullBrowser = `${name} ${match[1]}`;
//           break;
//         }
//       }
//     }

//     // Detect Operating System with version
//     if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
//     else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
//     else if (ua.includes("Windows NT 6.2")) os = "Windows 8";
//     else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
//     else if (ua.includes("Windows NT 6.0")) os = "Windows Vista";
//     else if (ua.includes("Windows NT 5.1")) os = "Windows XP";
//     else if (ua.includes("Windows")) os = "Windows";
//     else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) {
//       const versionMatch = ua.match(/Mac OS X ([0-9_]+)/);
//       os = versionMatch ? `macOS ${versionMatch[1].replace(/_/g, ".")}` : "macOS";
//     } else if (ua.includes("Android")) {
//       const versionMatch = ua.match(/Android ([0-9.]+)/);
//       os = versionMatch ? `Android ${versionMatch[1]}` : "Android";
//     } else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iOS")) {
//       const versionMatch = ua.match(/OS ([0-9_]+)/);
//       os = versionMatch ? `iOS ${versionMatch[1].replace(/_/g, ".")}` : "iOS";
//     } else if (ua.includes("Linux")) os = "Linux";
//     else if (ua.includes("X11")) os = "Unix";
//   } catch {
//     console.warn("Error detecting browser info");
//   }

//   return { browser: fullBrowser, os };
// };

// // Type definitions
// interface AddressData {
//   country: string;
//   region: string;
//   city: string;
//   zipcode: string;
//   fullAddress: string;
// }

// interface LocationInfo {
//   country: string;
//   region: string;
//   city: string;
//   zipcode: string;
//   ip: string;
//   accuracy: string;
//   coordinates?: { lat: number; lng: number };
//   fullAddress: string;
// }

// // GPS-based reverse geocoding
// async function getAddressFromCoords(lat: number, lng: number): Promise<AddressData> {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
//     );

//     if (!response.ok) throw new Error('Geocoding failed');

//     const data = await response.json();

//     if (data?.address) {
//       return {
//         country: data.address.country || 'Unknown',
//         region: data.address.state || data.address.region || 'Unknown',
//         city: data.address.city || data.address.town || data.address.village || 'Unknown',
//         zipcode: data.address.postcode || 'Unknown',
//         fullAddress: data.display_name || 'Unknown'
//       };
//     }

//     throw new Error('No address data received');
//   } catch {
//     console.error('Reverse geocoding error');

//     // Fallback: Try to get location from IP if GPS fails
//     try {
//       const ipResponse = await fetch('https://ipapi.co/json/');
//       const ipData = await ipResponse.json();

//       return {
//         country: ipData.country_name || 'Unknown',
//         region: ipData.region || ipData.region_code || 'Unknown',
//         city: ipData.city || 'Unknown',
//         zipcode: ipData.postal || ipData.postal_code || 'Unknown',
//         fullAddress: `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country_name || ''}`.trim()
//       };
//     } catch {
//       console.error('IP-based location also failed');
//     }

//     return {
//       country: 'Unknown',
//       region: 'Unknown',
//       city: 'Unknown',
//       zipcode: 'Unknown',
//       fullAddress: 'Location detection failed'
//     };
//   }
// }

// // Get accurate IP address
// async function getAccurateIP(): Promise<string> {
//   try {
//     const ipServices = [
//       'https://api.ipify.org?format=json',
//       'https://api64.ipify.org?format=json',
//       'https://ip.seeip.org/json'
//     ];

//     for (const service of ipServices) {
//       try {
//         const response = await fetch(service);
//         if (response.ok) {
//           const data = await response.json();
//           if (data.ip) return data.ip;
//         }
//       } catch {
//         console.warn(`IP service ${service} failed`);
//         continue;
//       }
//     }

//     return 'Unknown';
//   } catch {
//     console.error('All IP services failed');
//     return 'Unknown';
//   }
// }

// export default function DocuSignPage() {
//   const [frontFile, setFrontFile] = useState<File | null>(null);
//   const [backFile, setBackFile] = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview, setBackPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
//   const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'complete'>('upload');
//   const [acknowledged, setAcknowledged] = useState(true);
//   const [locationInfo, setLocationInfo] = useState<LocationInfo>({
//     country: 'Detecting...',
//     region: 'Detecting...',
//     city: 'Detecting...',
//     zipcode: 'Detecting...',
//     ip: 'Detecting...',
//     accuracy: 'Initializing...',
//     fullAddress: 'Detecting your location...'
//   });
//   const [browserInfo, setBrowserInfo] = useState<{ browser: string; os: string } | null>(null);
//   const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

//   const frontInputRef = useRef<HTMLInputElement>(null);
//   const backInputRef = useRef<HTMLInputElement>(null);

//   // Get browser info on component mount
//   useEffect(() => {
//     const detectBrowser = async () => {
//       const info = await getAccurateBrowserInfo();
//       console.log("🧭 Browser Info:", info);
//       setBrowserInfo(info);
//     };
//     detectBrowser();
//   }, []);

//   // Get IP address and initial location
//   useEffect(() => {
//     const initializeLocation = async () => {
//       try {
//         const ip = await getAccurateIP();

//         try {
//           const ipLocationResponse = await fetch('https://ipapi.co/json/');
//           const ipLocationData = await ipLocationResponse.json();

//           setLocationInfo({
//             country: ipLocationData.country_name || 'Unknown',
//             region: ipLocationData.region || ipLocationData.region_code || 'Unknown',
//             city: ipLocationData.city || 'Unknown',
//             zipcode: ipLocationData.postal || ipLocationData.postal_code || 'Unknown',
//             ip: ip,
//             accuracy: 'IP-based (approximate)',
//             fullAddress: `${ipLocationData.city || ''}, ${ipLocationData.region || ''}, ${ipLocationData.country_name || ''}`.trim() || 'Address not available'
//           });
//         } catch {
//           console.error('IP location failed');
//           setLocationInfo(prev => ({
//             ...prev,
//             ip: ip,
//             accuracy: 'IP-based (limited)'
//           }));
//         }
//       } catch {
//         console.error('IP detection failed');
//         setLocationInfo(prev => ({
//           ...prev,
//           ip: 'Unknown',
//           accuracy: 'Detection failed'
//         }));
//       }
//     };

//     initializeLocation();
//   }, []);

//   // Get EXACT location using GPS
//   useEffect(() => {
//     const getExactLocation = async () => {
//       if (!navigator.geolocation) {
//         setLocationInfo(prev => ({
//           ...prev,
//           accuracy: 'GPS not supported',
//           country: 'GPS Unavailable',
//           region: 'Use IP location',
//           city: 'N/A',
//           zipcode: 'N/A',
//           fullAddress: 'GPS not supported by browser'
//         }));
//         return;
//       }

//       try {
//         const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//           navigator.geolocation.getCurrentPosition(resolve, reject, {
//             enableHighAccuracy: true,
//             timeout: 15000,
//             maximumAge: 0
//           });
//         });

//         const { latitude, longitude } = position.coords;
//         const accuracy = position.coords.accuracy;

//         console.log('📍 GPS Coordinates:', { latitude, longitude, accuracy: `${accuracy}m` });

//         const address = await getAddressFromCoords(latitude, longitude);
//         const currentIP = await getAccurateIP();

//         setLocationInfo({
//           country: address.country,
//           region: address.region,
//           city: address.city,
//           zipcode: address.zipcode,
//           ip: currentIP,
//           accuracy: `GPS (${Math.round(accuracy)}m accuracy)`,
//           coordinates: { lat: latitude, lng: longitude },
//           fullAddress: address.fullAddress
//         });

//         setLocationPermission('granted');

//       } catch (error: unknown) {
//         console.error('GPS Error:', error);
//         const errorCode = (error as GeolocationPositionError).code;

//         if (errorCode === 1) {
//           setLocationPermission('denied');
//           setLocationInfo(prev => ({
//             ...prev,
//             accuracy: 'Permission denied - using IP location',
//             country: 'Location access required',
//             region: 'Please enable location',
//             city: 'for accurate detection',
//             zipcode: 'N/A',
//             fullAddress: 'Location access denied by user'
//           }));
//         } else {
//           setLocationInfo(prev => ({
//             ...prev,
//             accuracy: 'GPS unavailable - using IP location',
//             country: 'Location unavailable',
//             region: 'Check permissions',
//             city: 'or try again',
//             zipcode: 'N/A',
//             fullAddress: 'GPS location detection failed'
//           }));
//         }
//       }
//     };

//     if (window.isSecureContext) {
//       getExactLocation();
//     } else {
//       setLocationInfo(prev => ({
//         ...prev,
//         accuracy: 'GPS requires HTTPS',
//         fullAddress: 'GPS requires secure connection (HTTPS)'
//       }));
//     }
//   }, []);

//   // Request location permission if not granted
//   const requestLocationPermission = () => {
//     setLocationPermission('prompt');

//     if (!navigator.geolocation) {
//       setMessage({
//         text: "Geolocation is not supported by this browser.",
//         type: "error"
//       });
//       return;
//     }

//     if (!window.isSecureContext) {
//       setMessage({
//         text: "GPS location requires HTTPS secure connection.",
//         type: "error"
//       });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       () => {
//         setLocationPermission('granted');
//       },
//       (error: GeolocationPositionError) => {
//         setLocationPermission('denied');
//         let errorMessage = "Location access is required for accurate address detection.";

//         if (error.code === 1) {
//           errorMessage = "Location access was denied. Please enable location permissions in your browser settings.";
//         } else if (error.code === 2) {
//           errorMessage = "Location unavailable. Please check your device location settings.";
//         } else if (error.code === 3) {
//           errorMessage = "Location request timed out. Please try again.";
//         }

//         setMessage({
//           text: errorMessage,
//           type: "error"
//         });
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0
//       }
//     );
//   };

//   const handleFileSelect = async (file: File | null, type: 'front' | 'back') => {
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setMessage({ text: 'Please upload an image file', type: 'error' });
//         return;
//       }

//       try {
//         const compressedFile = await imageCompression(file, {
//           maxSizeMB: 2,
//           maxWidthOrHeight: 1920,
//           useWebWorker: true
//         });

//         const previewUrl = URL.createObjectURL(compressedFile);

//         if (type === 'front') {
//           setFrontFile(compressedFile);
//           setFrontPreview(previewUrl);
//         } else {
//           setBackFile(compressedFile);
//           setBackPreview(previewUrl);
//         }

//         setMessage(null);
//       } catch {
//         console.error("Image compression failed");
//         setMessage({ text: 'Image compression failed. Please try again.', type: 'error' });
//       }
//     }
//   };

//   const removeFile = (type: 'front' | 'back') => {
//     if (type === 'front') {
//       setFrontFile(null);
//       if (frontPreview) URL.revokeObjectURL(frontPreview);
//       setFrontPreview(null);
//     } else {
//       setBackFile(null);
//       if (backPreview) URL.revokeObjectURL(backPreview);
//       setBackPreview(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!acknowledged) {
//       setMessage({ text: "⚠️ Please confirm acknowledgment before submitting.", type: "error" });
//       return;
//     }

//     if (!frontFile && !backFile) {
//       setMessage({ text: "Please upload at least one photo (front or back).", type: "error" });
//       return;
//     }

//     if (locationPermission !== 'granted') {
//       setMessage({
//         text: "⚠️ Location access is recommended for document verification. Submitting without precise location.",
//         type: "error"
//       });
//     }

//     setLoading(true);
//     setMessage(null);
//     setCurrentStep("review");

//     try {
//       const { browser, os } = browserInfo || await getAccurateBrowserInfo();

//       const [frontBase64, backBase64] = await Promise.all([
//         frontFile ? fileToBase64(frontFile) : Promise.resolve(null),
//         backFile ? fileToBase64(backFile) : Promise.resolve(null),
//       ]);

//       const urlParams = new URLSearchParams(window.location.search);
//       const bookingId = urlParams.get("bookingId");

//       const payload = {
//         bookingId,
//         acknowledged,
//         frontImageBase64: frontBase64,
//         backImageBase64: backBase64,
//         device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
//         browser: browser || 'Unknown Browser',
//         os: os || 'Unknown OS',
//         ip: locationInfo?.ip || 'Unknown',
//         location: {
//           country: locationInfo.country,
//           region: locationInfo.region,
//           city: locationInfo.city,
//           zipcode: locationInfo.zipcode,
//           accuracy: locationInfo.accuracy,
//           fullAddress: locationInfo.fullAddress,
//           coordinates: locationInfo.coordinates
//         },
//         userAgent: navigator.userAgent,
//         screenResolution: `${window.screen.width}x${window.screen.height}`,
//         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//         language: navigator.language,
//         locationPermission: locationPermission
//       };

//       console.log('🚀 Final payload:', payload);

//       const res = await fetchWithTimeout("/api/docusign", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (data.ok) {
//         setMessage({
//           text: "✅ Thanks! Your documents & acknowledgment have been received.",
//           type: "success",
//         });
//         setCurrentStep("complete");
//       } else {
//         setMessage({
//           text: `Upload failed: ${data.message || "Please try again."}`,
//           type: "error",
//         });
//         setCurrentStep("upload");
//       }
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : "Unexpected error";
//       setMessage({
//         text: `Upload error: ${errorMessage}. Please try again.`,
//         type: "error"
//       });
//       setCurrentStep("upload");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const FileUploadArea = ({
//     type,
//     file,
//     preview,
//     inputRef
//   }: {
//     type: 'front' | 'back';
//     file: File | null;
//     preview: string | null;
//     inputRef: React.RefObject<HTMLInputElement | null>;
//   }) => (
//     <div className="relative group">
//       <div
//         className={`
//           border-2 border-dashed rounded-2xl p-6 transition-all duration-300 cursor-pointer
//           hover:border-green-400 hover:bg-green-50/50
//           ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300'}
//           ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//         `}
//         onClick={() => !loading && inputRef.current?.click()}
//       >
//         <input
//           ref={inputRef as React.RefObject<HTMLInputElement>}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => handleFileSelect(e.target.files?.[0] || null, type)}
//           disabled={loading}
//         />
//         {preview ? (
//           <div className="text-center">
//             <div className="relative inline-block">
//               <Image
//                 src={preview}
//                 alt={`${type} preview`}
//                 width={200}
//                 height={128}
//                 loading="lazy"
//                 className="h-32 w-auto rounded-lg shadow-md mx-auto object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   removeFile(type);
//                 }}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
//                 disabled={loading}
//               >
//                 <AlertCircle className="h-4 w-4" />
//               </button>
//             </div>
//             <p className="mt-3 text-sm font-medium text-green-700 truncate">{file?.name}</p>
//             <p className="text-xs text-gray-500 mt-1">Click to change photo</p>
//           </div>
//         ) : (
//           <div className="text-center">
//             <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
//               <Camera className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
//             </div>
//             <div className="mt-4">
//               <p className="text-sm font-medium text-gray-900">
//                 Upload {type === 'front' ? 'Front' : 'Back'} Photo
//               </p>
//               <p className="text-xs text-gray-500 mt-1">Click to browse or use camera</p>
//               <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
//               <p className="text-xs text-yellow-600 mt-1">Optional</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   if (currentStep === 'complete') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
//         <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">
//           <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
//             <CheckCircle className="h-10 w-10 text-green-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Documents Submitted!</h1>
//           <p className="text-gray-600 mb-6">
//             Thank you for uploading your documents. Our team will review them shortly.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           {/* <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to home
//           </Link> */}
//           <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <FileText className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
//           <p className="text-lg text-gray-600 max-w-md mx-auto">
//             Please upload clear photos of your document (front and/or back)
//           </p>
//           <p className="text-sm text-yellow-600 mt-2">
//             At least one photo (front or back) is required
//           </p>
//         </div>

//         <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FileUploadArea type="front" file={frontFile} preview={frontPreview} inputRef={frontInputRef} />
//               <FileUploadArea type="back" file={backFile} preview={backPreview} inputRef={backInputRef} />
//             </div>

//             <div className="flex items-start space-x-2">
//               <input
//                 type="checkbox"
//                 id="acknowledge"
//                 checked={acknowledged}
//                 onChange={(e) => setAcknowledged(e.target.checked)}
//                 className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <label htmlFor="acknowledge" className="text-sm text-gray-700">
//                 I hereby acknowledge that the documents I am submitting are valid and belong to me.
//               </label>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button
//                 type="submit"
//                 disabled={(!frontFile && !backFile) || loading}
//                 className={`
//                   flex-1 inline-flex items-center justify-center py-4 px-6 rounded-xl font-medium text-white
//                   transition-all duration-300 transform hover:scale-105
//                   ${(!frontFile && !backFile) || loading
//                     ? 'bg-gray-300 cursor-not-allowed'
//                     : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
//                   }
//                 `}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                     Uploading Documents...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="h-5 w-5 mr-2" />
//                     Submit Documents
//                   </>
//                 )}
//               </button>

//               <Link
//                 href="/"
//                 className="inline-flex items-center justify-center py-4 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </Link>
//             </div>

//             {locationPermission !== 'granted' && (
//               <div className="rounded-2xl p-4 flex items-start space-x-3 bg-orange-50 border border-orange-200">
//                 <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-orange-700 font-medium">Location Access Recommended</p>
//                   <p className="text-sm text-orange-600 mt-1">
//                     GPS location provides more accurate address verification. You can still submit with IP-based location.
//                   </p>
//                   <button
//                     onClick={requestLocationPermission}
//                     className="mt-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Allow Location Access
//                   </button>
//                 </div>
//               </div>
//             )}

//             {message && (
//               <div className={`rounded-2xl p-4 flex items-start space-x-3 ${
//                 message.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
//                 }`}>
//                 <AlertCircle className={`h-5 w-5 ${
//                   message.type === 'error' ? 'text-red-500' : 'text-green-500'
//                   } mt-0.5 flex-shrink-0`} />
//                 <p className={`text-sm ${
//                   message.type === 'error' ? 'text-red-700' : 'text-green-700'
//                   }`}>{message.text}</p>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }










import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import DocumentUploadForm from '../components/DocumentUploadForm';

export const metadata: Metadata = {
  title: 'Document Upload | EcoRide',
  description: 'Upload your document for verification. Clear photos of front and back required.',
  robots: {
    index: false,  // Don't index this page in search engines
    follow: false,
  },
};

export default function DocusignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section - Server Rendered */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Please upload clear photos of your document (front and/or back)
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            At least one photo (front or back) is required
          </p>
        </div>

        {/* Form Component - Client Side */}
        <DocumentUploadForm />
      </div>
    </div>
  );
}
