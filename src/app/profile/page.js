"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ProfileRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a tab parameter
    const tab = searchParams.get('tab');
    
    if (tab) {
      // Redirect to the specified tab (e.g., /profile/contact)
      router.replace(`/profile/${tab}`);
    } else {
      // Default redirect to sessions page
      router.replace('/profile/sessions');
    }
  }, [router, searchParams]);

  // Show minimal loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProfileRedirect />
    </Suspense>
  );
}
