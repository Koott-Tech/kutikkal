"use client";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ClientMessagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // Show loading while auth is loading
    if (authLoading) {
      return;
    }
    
    // If user is authenticated, redirect to profile with messages tab
    if (user) {
      router.push('/profile?tab=messages');
    } else {
      // If not authenticated, redirect to login
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Show loading screen while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to messages...</p>
      </div>
    </div>
  );
}
