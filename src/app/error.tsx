'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-6">
          An unexpected error occurred. Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gray-900 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
