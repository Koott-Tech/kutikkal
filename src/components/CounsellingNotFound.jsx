"use client";

import Link from 'next/link';

export default function CounsellingNotFound({ slug }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Counselling Service Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The counselling service "{slug?.replace(/[-_]/g, ' ')}" is not available or hasn't been published yet.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/counselling" 
            className="inline-block bg-[#593494] text-white px-6 py-3 rounded-lg hover:bg-[#7351A9] transition-colors duration-200"
          >
            Browse All Counselling Services
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these popular services:</p>
            <div className="mt-2 space-x-4">
              <Link href="/counselling/anxiety-sadness" className="text-[#593494] hover:underline">
                Anxiety Counselling
              </Link>
              <Link href="/counselling/depression" className="text-[#593494] hover:underline">
                Depression Counselling
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
