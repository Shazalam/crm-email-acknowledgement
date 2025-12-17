import { AlertCircle,Camera } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

// File Upload Area Component
interface FileUploadAreaProps {
    type: 'front' | 'back';
    file: File | null;
    preview: string | null;
    // ✅ FIX #3: Allow null in the ref type
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileSelect: (file: File | null, type: 'front' | 'back') => void;
    onRemove: (type: 'front' | 'back') => void;
    loading: boolean;
}

const FileUploadArea = ({
    type,
    file,
    preview,
    inputRef,
    onFileSelect,
    onRemove,
    loading
}: FileUploadAreaProps) => {
    return (
        <>
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
                        // ✅ FIX #2: Complete the optional chaining with [0]
                        onChange={(e) => onFileSelect(e.target.files?.[0] || null, type)}
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
                                    loading="lazy"
                                    className="h-32 w-auto rounded-lg shadow-md mx-auto object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(type);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                    disabled={loading}
                                >
                                    <AlertCircle className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="mt-3 text-sm font-medium text-green-700 truncate">{file?.name}</p>
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
                                <p className="text-xs text-gray-500 mt-1">Click to browse or use camera</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                <p className="text-xs text-yellow-600 mt-1">Optional</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FileUploadArea

