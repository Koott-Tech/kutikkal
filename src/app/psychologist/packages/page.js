"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { psychologistApi } from "../../../lib/backendApi";
import { 
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";

export default function PsychologistPackages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadPackages();
    }
  }, [user]);

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const packagesData = await psychologistApi.getPackages();
      setPackages(packagesData.data || []);
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Therapy Packages</h1>
          <p className="mt-2 text-sm text-gray-700">
            View your available therapy packages and pricing.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Packages</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No packages available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Contact your administrator to set up therapy packages.
              </p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {pkg.package_type.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">{pkg.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${pkg.price}
                      </span>
                      <span className="text-sm text-gray-500">per session</span>
                    </div>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Package Features</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-green-400 mt-2"></div>
                            </div>
                            <p className="ml-3 text-sm text-gray-600">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-gray-900">{pkg.duration || 'Standard'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">Sessions</span>
                      <span className="text-gray-900">{pkg.session_count || 'As needed'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Package Information */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Package Information</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">How It Works</h3>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Client Selects Package</h4>
                <p className="text-sm text-gray-500">
                  Clients choose a therapy package that best fits their needs and budget.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Book Sessions</h4>
                <p className="text-sm text-gray-500">
                  Clients book therapy sessions based on your available time slots.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Provide Therapy</h4>
                <p className="text-sm text-gray-500">
                  Conduct therapy sessions and track progress with your clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



