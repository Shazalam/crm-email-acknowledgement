'use client';
import { useState, useRef } from 'react';
import { UAParser } from 'ua-parser-js';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Camera,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocuSignPage() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'complete'>('upload');

  const [acknowledged, setAcknowledged] = useState(true);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null, type: 'front' | 'back') => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'front') {
        setFrontFile(file);
        setFrontPreview(previewUrl);
      } else {
        setBackFile(file);
        setBackPreview(previewUrl);
      }
      setMessage(null);
    }
  };

  const removeFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontFile(null);
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontPreview(null);
    } else {
      setBackFile(null);
      if (backPreview) URL.revokeObjectURL(backPreview);
      setBackPreview(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!acknowledged) {
      setMessage({ text: "⚠️ Please confirm acknowledgment before submitting.", type: "error" });
      return;
    }

    if (!frontFile || !backFile) {
      setMessage({ text: "Please upload both front and back photos.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setCurrentStep("review");

    const ua = new UAParser().getResult();
    try {
      const [frontBase64, backBase64] = await Promise.all([
        fileToBase64(frontFile),
        fileToBase64(backFile),
      ]);

      const urlParams = new URLSearchParams(window.location.search);
      const bookingId = urlParams.get("bookingId");

      const geo = await fetch("https://ipapi.co/json").then((res) => res.json());

      const payload = {
        bookingId,
        acknowledged,
        frontImageBase64: frontBase64,
        backImageBase64: backBase64,
        device: ua.device.type || "desktop",                                                                                                                                              
        browser: `${ua.browser.name || ""} ${ua.browser.version || ""}`.trim(),
        os: `${ua.os.name || ""} ${ua.os.version || ""}`.trim(),
        ip: geo.ip,
        location: {
          country: geo.country_name,
          region: geo.region,
          city: geo.city,
          zipcode: geo.postal,
        },
      };

      const res = await fetch("/api/docusign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage({
          text: "✅ Thanks! Your documents & acknowledgment have been received.",
          type: "success",
        });
        setCurrentStep("complete");
      } else {
        setMessage({
          text: `Upload failed: ${data.message || "Please try again."}`,
          type: "error",
        });
        setCurrentStep("upload");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setMessage({ text: `Upload error: ${message}`, type: "error" });
      setCurrentStep("upload");
    } finally {
      setLoading(false);
    }
  }

  const FileUploadArea = ({
    type,
    file,
    preview,
    inputRef
  }: {
    type: 'front' | 'back';
    file: File | null;
    preview: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>; // ✅ allow null here
  }) => (
    <div className="relative group">
      <div
        className={`
          border-2 border-dashed rounded-2xl p-6 transition-all duration-300 cursor-pointer
          hover:border-green-400 hover:bg-green-50/50
          ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null, type)}
          disabled={loading}
        />
        {preview ? (
          <div className="text-center">
            <div className="relative inline-block">
              <Image
                src={preview}
                alt={`${type} preview`}
                width={200}
                height={128}
                className="h-32 w-auto rounded-lg shadow-md mx-auto object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(type);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm font-medium text-green-700">{file?.name}</p>
            <p className="text-xs text-gray-500 mt-1">Click to change photo</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
              <Camera className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900">
                Upload {type === 'front' ? 'Front' : 'Back'} Photo
              </p>
              <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ✅ If submission complete → show a Success Screen
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Documents Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for uploading your documents. Our team will review them shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Default Upload UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Please upload clear photos of the front and back side of your document
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea type="front" file={frontFile} preview={frontPreview} inputRef={frontInputRef} />
              <FileUploadArea type="back" file={backFile} preview={backPreview} inputRef={backInputRef} />
            </div>

            {/* ✅ Acknowledgment */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="acknowledge" className="text-sm text-gray-700">
                I hereby acknowledge that the documents I am submitting are valid and belong to me.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={!frontFile || !backFile || loading}
                className={`
                  flex-1 inline-flex items-center justify-center py-4 px-6 rounded-xl font-medium text-white
                  transition-all duration-300 transform hover:scale-105
                  ${!frontFile || !backFile || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Uploading Documents...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Submit Documents
                  </>
                )}
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center py-4 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>

            {/* Error Message */}
            {message && message.type === 'error' && (
              <div
                className="rounded-2xl p-4 flex items-start space-x-3 bg-red-50 border border-red-200"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{message.text}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
