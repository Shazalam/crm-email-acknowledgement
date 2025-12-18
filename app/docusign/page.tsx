import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import DocumentUploadForm from './DocumentUploadForm';

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
