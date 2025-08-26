"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { 
  User,
  Mail,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function PsychologistSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    ug_college: '',
    pg_college: '',
    phd_college: '',
    area_of_expertise: '',
    description: ''
  });

  useEffect(() => {
    if (user && user.profile) {
      setProfile({
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        email: user.email || '',
        ug_college: user.profile.ug_college || '',
        pg_college: user.profile.pg_college || '',
        phd_college: user.profile.phd_college || '',
        area_of_expertise: Array.isArray(user.profile.area_of_expertise) 
          ? user.profile.area_of_expertise.join(', ') 
          : user.profile.area_of_expertise || '',
        description: user.profile.description || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your personal information and professional details.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    Undergraduate College
                  </label>
                  <input
                    type="text"
                    name="ug_college"
                    value={profile.ug_college}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., University of California"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    Postgraduate College
                  </label>
                  <input
                    type="text"
                    name="pg_college"
                    value={profile.pg_college}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Stanford University"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    PhD College (Optional)
                  </label>
                  <input
                    type="text"
                    name="phd_college"
                    value={profile.phd_college}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Harvard University"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Professional Details</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  Areas of Expertise
                </label>
                <input
                  type="text"
                  name="area_of_expertise"
                  value={profile.area_of_expertise}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Child Psychology, Family Therapy, Anxiety Disorders"
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple areas with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  Professional Description
                </label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your professional background, approach to therapy, and what makes you unique as a therapist..."
                />
                <p className="mt-1 text-xs text-gray-500">This will be visible to potential clients</p>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
