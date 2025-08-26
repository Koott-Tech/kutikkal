const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

// Debug logging
console.log('Environment variables:', {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  BACKEND_BASE_URL: BACKEND_BASE_URL
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      console.error('Backend API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: error,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Handle empty error responses
      if (!error || Object.keys(error).length === 0) {
        if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status === 204) {
          // No content - this is often successful for DELETE operations
          return null;
        } else if (response.status === 200) {
          // 200 with empty response - this is successful but no data
          return null;
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
      }
      
      throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      
      // If JSON parsing fails, provide a more helpful error message
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (response.statusText) {
        errorMessage += ` - ${response.statusText}`;
      }
      
      // Add specific error messages for common status codes
      switch (response.status) {
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found. The requested endpoint does not exist.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  // Handle successful responses
  try {
    const responseText = await response.text();
    
    // Handle empty responses
    if (!responseText || responseText.trim() === '') {
      return null;
    }
    
    return JSON.parse(responseText);
  } catch (parseError) {
    console.error('Response parsing failed:', parseError);
    throw new Error('Invalid response format from server');
  }
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
  // Debug logging
  console.log('API Request:', {
    endpoint,
    BACKEND_BASE_URL,
    fullUrl: url
  });
  
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Failed:', {
      url,
      error: error.message,
      errorType: error.constructor.name,
      errorStack: error.stack,
      fullError: error
    });
    throw error;
  }
}

// Authentication API
export const authApi = {
  // Client registration (only clients can register)
  async registerClient(clientData) {
    return apiRequest('/auth/register/client', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  // User login (all user types)
  async login(credentials) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get registration information
  async getRegistrationInfo() {
    return apiRequest('/auth/registration-info');
  },

  // Get current user profile
  async getProfile() {
    return apiRequest('/auth/profile');
  },

  // Update profile picture
  async updateProfilePicture(profilePictureUrl) {
    return apiRequest('/auth/profile-picture', {
      method: 'PUT',
      body: JSON.stringify({ profile_picture_url: profilePictureUrl }),
    });
  },

  // Change password
  async changePassword(passwords) {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },

  // Logout
  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Client API
export const clientApi = {
  // Get client profile
  async getProfile() {
    return apiRequest('/clients/profile');
  },

  // Update client profile
  async updateProfile(profileData) {
    return apiRequest('/clients/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get client sessions
  async getSessions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/clients/sessions?${queryParams}`);
  },

  // Book a session
  async bookSession(sessionData) {
    return apiRequest('/clients/book-session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Cancel a session
  async cancelSession(sessionId) {
    return apiRequest(`/clients/sessions/${sessionId}/cancel`, {
      method: 'PUT',
    });
  },

  // Get available psychologists
  async getPsychologists(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/clients/psychologists?${queryParams}`);
  },
};

// Psychologist API
export const psychologistApi = {
  // Get psychologist profile
  async getProfile() {
    return apiRequest('/psychologists/profile');
  },

  // Update psychologist profile
  async updateProfile(profileData) {
    return apiRequest('/psychologists/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get psychologist sessions
  async getSessions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/psychologists/sessions?${queryParams}`);
  },

  // Update session (notes, summary, status)
  async updateSession(sessionId, updateData) {
    return apiRequest(`/psychologists/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Get availability
  async getAvailability(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/psychologists/availability?${queryParams}`);
  },

  // Update availability
  async updateAvailability(availabilityData) {
    return apiRequest('/psychologists/availability', {
      method: 'PUT',
      body: JSON.stringify(availabilityData),
    });
  },

  // Add new availability
  async addAvailability(availabilityData) {
    return apiRequest('/psychologists/availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  },

  // Delete availability
  async deleteAvailability(availabilityId) {
    return apiRequest(`/psychologists/availability/${availabilityId}`, {
      method: 'DELETE',
    });
  },

  // Get packages
  async getPackages() {
    return apiRequest('/psychologists/packages');
  },

  // Create package
  async createPackage(packageData) {
    return apiRequest('/psychologists/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  },

  // Update package
  async updatePackage(packageId, packageData) {
    return apiRequest(`/psychologists/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  },

  // Delete package
  async deletePackage(packageId) {
    return apiRequest(`/psychologists/packages/${packageId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminApi = {
  // Get all users
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/admin/users?${queryParams}`);
  },

  // Get all psychologists directly from psychologists table
  async getPsychologists(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/admin/psychologists?${queryParams}`);
  },

  // Get user details
  async getUserDetails(userId) {
    return apiRequest(`/admin/users/${userId}`);
  },

  // Update user role
  async updateUserRole(userId, newRole) {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ new_role: newRole }),
    });
  },

  // Deactivate user
  async deactivateUser(userId, reason) {
    return apiRequest(`/admin/users/${userId}/deactivate`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  // Get platform statistics
  async getPlatformStats(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/admin/stats/platform?${queryParams}`);
  },

  // Search users
  async searchUsers(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/admin/search/users?${queryParams}`);
  },

  // Create psychologist (admin only)
  async createPsychologist(psychologistData) {
    return apiRequest('/admin/psychologists', {
      method: 'POST',
      body: JSON.stringify(psychologistData),
    });
  },

  // Update psychologist (admin only)
  async updatePsychologist(psychologistId, psychologistData) {
    return apiRequest(`/admin/psychologists/${psychologistId}`, {
      method: 'PUT',
      body: JSON.stringify(psychologistData),
    });
  },

  // Delete psychologist (admin only)
  async deletePsychologist(psychologistId) {
    return apiRequest(`/admin/psychologists/${psychologistId}`, {
      method: 'DELETE',
    });
  },

  // Create user (admin only)
  async createUser(userData) {
    return apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user (admin only)
  async updateUser(userId, userData) {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Superadmin API
export const superadminApi = {
  // Create admin user
  async createAdmin(adminData) {
    return apiRequest('/superadmin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  // Delete user
  async deleteUser(userId) {
    return apiRequest(`/superadmin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Get platform analytics
  async getPlatformAnalytics(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/superadmin/analytics/platform?${queryParams}`);
  },

  // System maintenance
  async systemMaintenance(action, target) {
    return apiRequest('/superadmin/maintenance', {
      method: 'POST',
      body: JSON.stringify({ action, target }),
    });
  },

  // Get system logs
  async getSystemLogs(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/superadmin/logs/system?${queryParams}`);
  },
};

// Dashboard API
export const dashboardApi = {
  // Get recent users for dashboard
  async getRecentUsers(limit = 5) {
    return apiRequest(`/admin/recent-users?limit=${limit}`);
  },

  // Get recent bookings for dashboard
  async getRecentBookings(limit = 5) {
    return apiRequest(`/admin/recent-bookings?limit=${limit}`);
  },

  // Get dashboard statistics
  async getDashboardStats() {
    return apiRequest('/admin/stats/dashboard');
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    return apiRequest(`/admin/activities?limit=${limit}`);
  },
};

// Sessions API
export const sessionsApi = {
  // Create session (admin only)
  async createSession(sessionData) {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Get session by ID (public)
  async getSession(sessionId) {
    return apiRequest(`/sessions/${sessionId}`);
  },

  // Get all sessions (admin only)
  async getAllSessions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/sessions?${queryParams}`);
  },

  // Update session status (admin only)
  async updateSessionStatus(sessionId, status, notes) {
    return apiRequest(`/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Reschedule session (admin only)
  async rescheduleSession(sessionId, newDate, newTime) {
    return apiRequest(`/sessions/${sessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ new_date: newDate, new_time: newTime }),
    });
  },

  // Get session statistics (admin only)
  async getSessionStats(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/sessions/stats/overview?${queryParams}`);
  },

  // Advanced session search (admin only)
  async searchSessions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/sessions/search/advanced?${queryParams}`);
  },

  // Delete session (admin only)
  async deleteSession(sessionId) {
    return apiRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },
};

// Public API (no authentication required)
export const publicApi = {
  // Get all psychologists (public)
  async getPsychologists() {
    return apiRequest('/public/psychologists');
  },

  // Get psychologist availability (public)
  async getPsychologistAvailability(psychologistId) {
    return apiRequest(`/public/psychologists/${psychologistId}/availability`);
  },
};

export default {
  auth: authApi,
  client: clientApi,
  psychologist: psychologistApi,
  admin: adminApi,
  superadmin: superadminApi,
  sessions: sessionsApi,
  dashboard: dashboardApi,
};
