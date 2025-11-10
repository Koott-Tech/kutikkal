"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { clientApi } from "../../../lib/backendApi";
import { FileText, Calendar } from "lucide-react";

export default function PackagesPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [clientPackages, setClientPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      if (hasRole('client')) {
        const packagesData = await clientApi.getClientPackages();
        const rawPackages = packagesData.data?.clientPackages || [];
        const normalized = rawPackages.map(pkg => {
          const totalSessions = Number.isFinite(pkg.total_sessions)
            ? pkg.total_sessions
            : Number(pkg.package?.session_count) || 0;

          const remainingSessions = Number.isFinite(pkg.remaining_sessions)
            ? pkg.remaining_sessions
            : Math.max(totalSessions - 1, 0);

          return {
            ...pkg,
            total_sessions: totalSessions,
            remaining_sessions: remainingSessions
          };
        });
        setClientPackages(normalized);
      }
    } catch (err) {
      console.error('Error loading packages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h5 className="text-gray-900 mb-6">My Packages</h5>
      {clientPackages.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h6 className="text-gray-900 mb-2">No packages purchased yet</h6>
          <p className="text-gray-600">You can browse therapists and purchase packages from the guide page.</p>
          <button
            onClick={() => router.push('/guide')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Browse Therapists
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {clientPackages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {pkg.package_type ? pkg.package_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Package'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Sessions:</span> {pkg.total_sessions}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Remaining:</span> 
                        <span className={`ml-1 ${pkg.remaining_sessions > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pkg.remaining_sessions}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Amount:</span> ${pkg.total_amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          pkg.status === 'active' ? 'bg-green-100 text-green-800' : 
                          pkg.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pkg.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Purchased: {new Date(pkg.purchased_at).toLocaleDateString()}
                  </p>
                  {pkg.psychologist && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Therapist:</span> {pkg.psychologist.first_name} {pkg.psychologist.last_name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {pkg.remaining_sessions > 0 && pkg.status === 'active' ? (
                    <button
                      onClick={() => router.push(`/therapist-profile?doctor=${pkg.psychologist?.id || 0}&package_id=${pkg.id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Remaining Sessions
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm px-3 py-2 bg-gray-100 rounded-lg">
                      {pkg.status === 'completed' ? 'Package Completed' : 'No sessions remaining'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

