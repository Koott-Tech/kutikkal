'use client';

import { useEffect, useState } from 'react';
import BlogPost from '@/components/BlogPost';

export default function BlogPreviewPage() {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only access sessionStorage on the client
    try {
      const dataStr = sessionStorage.getItem('blogPreviewData');
      if (dataStr) {
        setPreviewData(JSON.parse(dataStr));
      }
    } catch (e) {
      console.error('Failed to parse preview data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3f2e73]"></div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <h1 className="text-3xl font-bold text-[#3f2e73] mb-4">No Preview Data Found</h1>
        <p className="text-gray-600 mb-6">
          Could not find any unsaved blog data to preview. Please return to the editor and click "Preview" again.
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-amber-100 text-amber-800 text-center py-2 text-sm font-medium">
        Preview Mode — You are viewing unsaved changes.
      </div>
      <BlogPost isPreview={true} previewData={previewData} />
    </main>
  );
}
