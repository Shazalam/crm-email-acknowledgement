'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import FileUploadArea from '../components/FileUploadArea';
import { useLocation } from '../hooks/useLocation';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setMessage } from '../redux/features/documentUpload/documentUploadSlice';
import { uploadDocuments } from '../redux/features/documentUpload/documentUploadThunks';
import { selectUploadAcknowledged, selectUploadLoading, selectUploadMessage, selectUploadStep } from '../redux/features/documentUpload/documentUploadSelectors';


export default function DocumentUploadForm() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectUploadLoading);
  const message = useAppSelector(selectUploadMessage);
  const currentStep = useAppSelector(selectUploadStep);
  const acknowledged = useAppSelector(selectUploadAcknowledged);

  const {
    locationInfo,
    permission,
    loading: locationLoading,
    requestPermission
  } = useLocation();

  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File | null, type: 'front' | 'back') => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        dispatch(setMessage({ text: 'Please upload an image file', type: 'error' }));
        return;
      }

      try {
        const imageCompression = (await import('browser-image-compression')).default;
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        const previewUrl = URL.createObjectURL(compressedFile);

        if (type === 'front') {
          setFrontFile(compressedFile);
          setFrontPreview(previewUrl);
        } else {
          setBackFile(compressedFile);
          setBackPreview(previewUrl);
        }

        dispatch(setMessage(null as any)); // or create separate action to clear
      } catch {
        console.error('Image compression failed');
        dispatch(
          setMessage({
            text: 'Image compression failed. Please try again.',
            type: 'error',
          })
        );
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      uploadDocuments({
        frontFile,
        backFile,
        acknowledged,
        permission,
        locationInfo
      })
    );
  };

  if (currentStep === 'complete') {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Documents Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for uploading your documents. Our team will review them shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadArea
            type="front"
            file={frontFile}
            preview={frontPreview}
            inputRef={frontInputRef}
            onFileSelect={handleFileSelect}
            onRemove={removeFile}
            loading={loading}
          />
          <FileUploadArea
            type="back"
            file={backFile}
            preview={backPreview}
            inputRef={backInputRef}
            onFileSelect={handleFileSelect}
            onRemove={removeFile}
            loading={loading}
          />
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            // onChange={(e) => dispatch(setAcknowledged(e.target.checked))}
            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="acknowledge" className="text-sm text-gray-700">
            I hereby acknowledge that the documents I am submitting are valid and belong to me.
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={(!frontFile && !backFile) || loading}
            className={`
              flex-1 inline-flex items-center justify-center py-4 px-6 rounded-xl font-medium text-white
              transition-all duration-300 transform hover:scale-105
              ${(!frontFile && !backFile) || loading
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
        </div>

        {permission !== 'granted' && (
          <div className="rounded-2xl p-4 flex items-start space-x-3 bg-orange-50 border border-orange-200">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-700 font-medium">Location Access Recommended</p>
              <p className="text-sm text-orange-600 mt-1">
                GPS location provides more accurate address verification. You can still submit with IP-based location.
              </p>
              <button
                onClick={requestPermission}
                type="button"
                className="mt-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Allow Location Access
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`rounded-2xl p-4 flex items-start space-x-3 ${
              message.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <AlertCircle
              className={`h-5 w-5 ${
                message.type === 'error' ? 'text-red-500' : 'text-green-500'
              } mt-0.5 flex-shrink-0`}
            />
            <p
              className={`text-sm ${
                message.type === 'error' ? 'text-red-700' : 'text-green-700'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
