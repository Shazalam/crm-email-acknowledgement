import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import ContextCollector from './ContextCollector';

export const metadata: Metadata = {
  title: 'Acknowledgement Received | EcoRide',
  description: 'Your acknowledgement has been recorded. We are getting the next step ready.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificationContextPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-sky-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You for Acknowledging
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your acknowledgement has been recorded. We’re now getting everything
            ready so you can continue with your booking smoothly.
          </p>
        </div>

        {/* Client-side context collector (runs silently) */}
        <ContextCollector />
      </div>
    </div>
  );
}
