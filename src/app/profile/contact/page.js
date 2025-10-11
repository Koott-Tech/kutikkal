"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { clientApi, authApi } from "../../../lib/backendApi";

export default function ContactPage() {
  const { user, token, login, hasRole, isLoading: authLoading } = useAuth();
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    child_name: '',
    child_age: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        console.log('📋 User object in contact page:', user);
        
        try {
          // Fetch the full profile data from backend
          const response = await authApi.getProfile();
          console.log('📋 Profile API response:', response);
          
          if (response?.data?.user) {
            const profileData = response.data.user.profile || response.data.user;
            console.log('📋 Profile data:', profileData);
            
            setProfileForm({
              first_name: profileData.first_name || '',
              last_name: profileData.last_name || '',
              phone_number: profileData.phone_number || '',
              child_name: profileData.child_name || '',
              child_age: profileData.child_age || ''
            });
          }
        } catch (error) {
          console.error('📋 Error fetching profile:', error);
          // Fallback to user object if API fails
          const profile = user.profile || user;
          setProfileForm({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            phone_number: profile.phone_number || '',
            child_name: profile.child_name || '',
            child_age: profile.child_age || ''
          });
        } finally {
          setIsDataLoaded(true);
        }
      }
    };
    
    fetchProfileData();
  }, [user]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async (e) => {
    e?.preventDefault?.();
    setProfileSaveMsg("");
    try {
      setIsSavingProfile(true);
      
      if (!profileForm.first_name || !profileForm.last_name || !profileForm.phone_number || 
          !profileForm.child_name || !profileForm.child_age) {
        setProfileSaveMsg('Please fill in all required fields: First Name, Last Name, Phone Number, Child Name, and Child Age.');
        return;
      }

      await clientApi.updateProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone_number: profileForm.phone_number,
        child_name: profileForm.child_name || null,
        child_age: profileForm.child_age ? Number(profileForm.child_age) : null
      });

      const refreshed = await authApi.getProfile();
      if (refreshed?.data?.user) {
        login(refreshed.data.user, token);
        
        const refreshedProfile = refreshed.data.user.profile || {};
        setProfileForm({
          first_name: refreshedProfile.first_name || '',
          last_name: refreshedProfile.last_name || '',
          phone_number: refreshedProfile.phone_number || '',
          child_name: refreshedProfile.child_name || '',
          child_age: refreshedProfile.child_age || ''
        });
      }
      setProfileSaveMsg('Contact information saved successfully.');
    } catch (err) {
      console.error('Save contact failed:', err);
      setProfileSaveMsg(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (authLoading || !isDataLoaded) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h5 className="text-gray-900 mb-6">Contact Information</h5>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h6 className="text-blue-800 mb-2">Required Information</h6>
        <p className="text-blue-700">
          All fields below are required to book therapy sessions. This information helps us provide personalized care for your child.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSaveContact}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={profileForm.first_name}
              onChange={handleProfileInputChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !profileForm.first_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={profileForm.last_name}
              onChange={handleProfileInputChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !profileForm.last_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={profileForm.phone_number}
            onChange={handleProfileInputChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !profileForm.phone_number ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
            required
          />
        </div>

        {hasRole('client') && (
          <div className="border-t pt-6">
            <h6 className="text-gray-900 mb-4">Child Information</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="child_name"
                  value={profileForm.child_name}
                  onChange={handleProfileInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !profileForm.child_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Your child's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="child_age"
                  min="1"
                  max="18"
                  value={profileForm.child_age}
                  onChange={handleProfileInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !profileForm.child_age ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Age"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {profileSaveMsg && (
          <div className={`p-3 rounded border text-sm ${profileSaveMsg.includes('successfully') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {profileSaveMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {isSavingProfile ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </form>
    </div>
  );
}

