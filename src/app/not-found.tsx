import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded text-sm transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded text-sm transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
