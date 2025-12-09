import { clearAuthData, getStoredToken } from './authStorage';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

// Global refresh token callback - will be set by AuthContext
let globalRefreshTokenCallback = null;

// Function to set the refresh token callback
export const setRefreshTokenCallback = (callback) => {
  console.log('🔍 Setting refresh token callback:', !!callback);
  globalRefreshTokenCallback = callback;
};

// Debug logging
console.log('Environment variables:', {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  BACKEND_BASE_URL: BACKEND_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

// Helper function to handle API responses
const handleResponse = async (response, options = {}) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      
      // Only log errors if not silenced
      if (!options.silent) {
        console.error('Backend API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          headers: Object.fromEntries(response.headers.entries())
        });
      }
      
      // Handle authentication/authorization errors - auto logout
      // Skip auto-redirect for login/register endpoints (they handle errors themselves)
      const isAuthEndpoint = options.endpoint?.includes('/auth/login') || 
                            options.endpoint?.includes('/auth/register');
      
      // For login/register endpoints, let them handle their own errors (including 400 for validation/duplicate email)
      if (isAuthEndpoint && (response.status === 400 || response.status === 401 || response.status === 403)) {
        // Return the actual error message from the backend for login/register
        const backendError = error?.message || error?.error || 'Authentication failed';
        // Create and throw error immediately - don't let it fall through to other handlers
        // This error will be caught by the outer catch and re-thrown
        const authError = new Error(backendError);
        // Store the error in a way that won't be caught by the parseError handler
        throw authError;
      }
      
      if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
        // Check if it's a token expiration error
        const isTokenExpired = error.error === 'Token expired' || 
                              error.error === 'bad_jwt' || 
                              error.message?.includes('expired') ||
                              error.message?.includes('token is expired');
        
        console.log('🔒 Auth Error Detected:', {
          status: response.status,
          isTokenExpired,
          error: error
        });
        
        // Clear auth data
        if (typeof window !== 'undefined') {
          clearAuthData();
          
          // Store error message for auth modal to display
          const errorMsg = isTokenExpired 
            ? 'Your session has expired. Please log in again to continue.' 
            : 'Authentication failed. Please log in again.';
          localStorage.setItem('auth_error', errorMsg);
          
          // Redirect to home - auth modal will be shown by components that need it
          window.location.href = '/';
        }
        
        throw new Error(isTokenExpired ? 'Session expired' : 'Authentication failed');
      }
      
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
      
      // For login/register endpoints, we already handled them above, so this shouldn't be reached
      // But just in case, preserve the original error message from backend
      const errorMsg = error?.message || error?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    } catch (parseError) {
      // If this is already an Error object (from our throw above), re-throw it immediately
      // This preserves the original error message from the backend
      if (parseError instanceof Error && parseError.message && !parseError.message.includes('HTTP error')) {
        // This is a valid error we threw - re-throw it as-is
        throw parseError;
      }
      
      // Only log if it's actually a parse error (not an Error we threw)
      if (!(parseError instanceof Error)) {
        console.error('Failed to parse error response:', parseError);
      }
      
      // If JSON parsing fails, provide a more helpful error message
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (response.statusText) {
        errorMessage += ` - ${response.statusText}`;
      }
      
      // Add specific error messages for common status codes
      // But preserve any specific error message we might have
      const isAuthEndpoint = options.endpoint?.includes('/auth/login') || 
                            options.endpoint?.includes('/auth/register');
      
      switch (response.status) {
        case 400:
          // For auth endpoints, preserve the error message we threw earlier
          // The error should have been re-thrown above, but if we reach here, use the error message
          if (isAuthEndpoint) {
            // If parseError is an Error with a message, use it (it should have been re-thrown, but just in case)
            if (parseError instanceof Error && parseError.message && !parseError.message.includes('HTTP error')) {
              errorMessage = parseError.message;
            } else {
              // Fallback: try to get message from the error object if available
              errorMessage = 'Please check your input and try again.';
            }
          } else {
            errorMessage = 'Please check your input and try again.';
          }
          break;
        case 401:
        case 403:
          // Auto logout on auth errors even if parsing fails
          // Skip auto-redirect for login/register endpoints (they handle errors themselves)
          const isAuthEndpointParse = options.endpoint?.includes('/auth/login') || 
                                options.endpoint?.includes('/auth/register');
          if (typeof window !== 'undefined' && !isAuthEndpointParse) {
            clearAuthData();
            localStorage.setItem('auth_error', 'Your session has expired. Please log in again.');
            window.location.href = '/';
          }
          // For login/register endpoints, provide a more helpful message
          if (isAuthEndpointParse) {
            errorMessage = 'Invalid email or password. No account found. Please create a new account.';
          } else {
          errorMessage = 'Authentication required. Please log in again.';
          }
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

// Helper function to make API requests with token refresh support
async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
  // Debug logging (skip if silent)
  if (!options.silent) {
    console.log('API Request:', {
      endpoint,
      BACKEND_BASE_URL,
      fullUrl: url
    });
  }
  
  // Get token from localStorage if available
  let token = typeof window !== 'undefined' ? getStoredToken() : null;
  
  if (!options.silent) {
    console.log('🔍 API Request Debug:', {
      endpoint,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      url
    });
  }
  
  const makeRequest = async (authToken) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // If we get a 401 and have a refresh callback, try to refresh the token
    if (response.status === 401 && globalRefreshTokenCallback && authToken) {
      console.log('🔍 Got 401, attempting token refresh...', {
        hasCallback: !!globalRefreshTokenCallback,
        hasToken: !!authToken,
        status: response.status
      });
      const newToken = await globalRefreshTokenCallback();
      
      if (newToken && newToken !== authToken) {
        console.log('🔍 Token refreshed, retrying request...');
        // Retry the request with the new token
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        };
        return await fetch(url, retryConfig);
      }
    }
    
    return response;
  };

  try {
    const response = await makeRequest(token);
    return await handleResponse(response, { silent: options.silent, endpoint: endpoint });
  } catch (error) {
    // Only log errors if not silenced
    if (!options.silent) {
      console.error('API Request Failed:', {
        url,
        error: error.message,
        errorType: error.constructor.name,
        errorStack: error.stack,
        fullError: error
      });
    }
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
  async getProfile(options = {}) {
    return apiRequest('/auth/profile', options);
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

  // Send password reset OTP
  async sendPasswordResetOTP(email) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Google OAuth login
  async googleLogin(idToken) {
    return apiRequest('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  // Reset password with OTP
  async resetPassword(email, otp, newPassword) {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
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

  // Get single session with summary
  async getSession(sessionId) {
    return apiRequest(`/clients/sessions/${sessionId}`);
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

  // Request reschedule for a session
  async requestReschedule(sessionId) {
    return apiRequest(`/clients/sessions/${sessionId}/reschedule-request`, {
      method: 'POST',
    });
  },

  // Reschedule session with new date/time
  async rescheduleSession(sessionId, rescheduleData) {
    return apiRequest(`/clients/sessions/${sessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(rescheduleData),
    });
  },

  // Get free assessment availability for rescheduling
  async getFreeAssessmentAvailabilityForReschedule(sessionId) {
    return apiRequest(`/clients/sessions/${sessionId}/free-assessment-availability`, {
      method: 'GET',
    });
  },

  // Submit session feedback
  async submitSessionFeedback(sessionId, feedbackData) {
    return apiRequest(`/clients/sessions/${sessionId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  // Get client packages
  async getClientPackages() {
    return apiRequest('/clients/packages', {
      method: 'GET'
    });
  },

  // Book remaining session from package
  async bookRemainingSession(data) {
    return apiRequest('/clients/book-remaining-session', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Reserve assessment slot for payment
  async reserveAssessmentSlot(data) {
    return apiRequest('/clients/assessments/reserve-slot', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Book assessment session (after payment)
  async bookAssessment(data) {
    return apiRequest('/clients/assessments/book', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get assessment sessions
  async getAssessmentSessions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return apiRequest(`/clients/assessments/sessions?${queryParams}`);
  },

  // Reschedule assessment session (client)
  async rescheduleAssessmentSession(assessmentSessionId, data) {
    return apiRequest(`/clients/assessments/sessions/${assessmentSessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Reserve time slot for payment
  async reserveSlot(data) {
    return apiRequest('/clients/reserve-slot', {
      method: 'POST',
      body: JSON.stringify(data)
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

  // Get client receipts
  async getReceipts() {
    return apiRequest('/clients/receipts');
  },

  // Download receipt
  async downloadReceipt(receiptId) {
    return apiRequest(`/clients/receipts/${receiptId}/download`);
  },

  // Get receipt by Razorpay order ID
  async getReceiptByOrderId(orderId) {
    return apiRequest(`/clients/receipts/order/${orderId}`);
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

  // Complete session with summary, report, and notes
  async completeSession(sessionId, sessionData) {
    return apiRequest(`/sessions/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  // Delete regular session
  async deleteSession(sessionId) {
    return apiRequest(`/psychologists/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Schedule pending assessment session
  async scheduleAssessmentSession(assessmentSessionId, scheduleData) {
    return apiRequest(`/psychologists/assessment-sessions/${assessmentSessionId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  },

  // Delete assessment session
  async deleteAssessmentSession(assessmentSessionId) {
    return apiRequest(`/psychologists/assessment-sessions/${assessmentSessionId}`, {
      method: 'DELETE',
    });
  },

  // Reschedule assessment session (psychologist)
  async rescheduleAssessmentSession(assessmentSessionId, data) {
    return apiRequest(`/psychologists/assessment-sessions/${assessmentSessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Respond to reschedule request
  async respondToRescheduleRequest(sessionId, responseData) {
    return apiRequest(`/psychologists/sessions/${sessionId}/reschedule-response`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  },

  // Handle reschedule request (approve/reject)
  async handleRescheduleRequest(notificationId, action, reason = '') {
    return apiRequest(`/sessions/reschedule-request/${notificationId}`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
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

  // Get Google Calendar events
  async getGoogleCalendarEvents(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/psychologists/google-calendar/events?${queryParams}`);
  },

  // Get notifications
  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/notifications?${queryParams}`);
  },

  // Get unread notification count
  async getUnreadNotificationCount() {
    return apiRequest('/notifications/unread-count');
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    return apiRequest('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  // Delete notification
  async deleteNotification(notificationId) {
    return apiRequest(`/notifications/${notificationId}`, {
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

  // Upload image (admin)
  async uploadImage(file) {
    const url = `${BACKEND_BASE_URL}/admin/upload/image`;
    const token = typeof window !== 'undefined' ? getStoredToken() : null;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });
    const result = await handleResponse(response);
    return result;
  },

  // Delete psychologist (admin only)
  async deletePsychologist(psychologistId) {
    return apiRequest(`/admin/psychologists/${psychologistId}`, {
      method: 'DELETE',
    });
  },

  // Create packages for psychologist (admin only)
  async createPsychologistPackages(psychologistId, packagesData) {
    return apiRequest(`/admin/psychologists/${psychologistId}/packages`, {
      method: 'POST',
      body: JSON.stringify(packagesData),
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

  // Reschedule session
  async rescheduleSession(sessionId, rescheduleData) {
    return apiRequest(`/admin/sessions/${sessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(rescheduleData),
    });
  },

  // Get psychologist availability for reschedule
  async getPsychologistAvailabilityForReschedule(psychologistId, startDate, endDate) {
    return apiRequest(`/admin/psychologists/${psychologistId}/availability?startDate=${startDate}&endDate=${endDate}`);
  },

  // Get all reschedule requests
  async getRescheduleRequests(status) {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/admin/reschedule-requests${query}`);
  },

  // Approve assessment reschedule request
  async approveAssessmentRescheduleRequest(notificationId, data) {
    return apiRequest(`/admin/reschedule-requests/assessment/${notificationId}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Reschedule assessment session (admin)
  async rescheduleAssessmentSession(assessmentSessionId, data) {
    return apiRequest(`/admin/assessment-sessions/${assessmentSessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete assessment session (admin)
  async deleteAssessmentSession(assessmentSessionId) {
    return apiRequest(`/admin/assessment-sessions/${assessmentSessionId}`, {
      method: 'DELETE',
    });
  },

  // Set availability for a psychologist (admin)
  async setPsychologistAvailability({ psychologist_id, date, time_slots, is_available = true }) {
    return apiRequest('/availability/set', {
      method: 'POST',
      body: JSON.stringify({ psychologist_id, date, time_slots, is_available })
    });
  },

  // Get psychologist calendar events
  async getPsychologistCalendarEvents(psychologistId, startDate, endDate) {
    return apiRequest(`/admin/psychologists/${psychologistId}/calendar-events?startDate=${startDate}&endDate=${endDate}`);
  },

  // Create manual booking (admin only)
  async createManualBooking(bookingData) {
    return apiRequest('/admin/bookings/manual', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Free Assessment Timeslots API
  async getFreeAssessmentTimeslots() {
    return apiRequest('/free-assessment-timeslots');
  },

  async createFreeAssessmentTimeslot(timeslotData) {
    return apiRequest('/free-assessment-timeslots', {
      method: 'POST',
      body: JSON.stringify(timeslotData),
    });
  },

  async updateFreeAssessmentTimeslot(id, timeslotData) {
    return apiRequest(`/free-assessment-timeslots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(timeslotData),
    });
  },

  async deleteFreeAssessmentTimeslot(id) {
    return apiRequest(`/free-assessment-timeslots/${id}`, {
      method: 'DELETE',
    });
  },

  async bulkCreateFreeAssessmentTimeslots(timeslotsData) {
    return apiRequest('/free-assessment-timeslots/bulk', {
      method: 'POST',
      body: JSON.stringify(timeslotsData),
    });
  },

  async bulkUpdateFreeAssessmentTimeslots(timeslotsData) {
    return apiRequest('/free-assessment-timeslots/bulk/update', {
      method: 'PUT',
      body: JSON.stringify(timeslotsData),
    });
  },

  async getDateConfigsRange(startDate, endDate) {
    return apiRequest(`/free-assessment-timeslots/date-configs-range?startDate=${startDate}&endDate=${endDate}`);
  },

  async createDateConfig(dateConfigData) {
    return apiRequest('/free-assessment-timeslots/date-config', {
      method: 'POST',
      body: JSON.stringify(dateConfigData),
    });
  },

  async deleteDateConfig(date) {
    return apiRequest(`/free-assessment-timeslots/date-config/${date}`, {
      method: 'DELETE',
    });
  },

  async getAvailabilityRange(startDate, endDate) {
    return apiRequest(`/free-assessment-timeslots/availability-range?startDate=${startDate}&endDate=${endDate}`);
  },

  // Counselling Services Management
  async getCounsellingServices(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/counselling/admin?${queryParams}`);
  },

  async getCounsellingService(id) {
    return apiRequest(`/counselling/admin/${id}`);
  },

  async createCounsellingService(serviceData) {
    return apiRequest('/counselling/admin', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  async updateCounsellingService(id, serviceData) {
    return apiRequest(`/counselling/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  async deleteCounsellingService(id) {
    return apiRequest(`/counselling/admin/${id}`, {
      method: 'DELETE',
    });
  },

  // Assessment Services Management
  async getAssessments(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/assessments/admin?${queryParams}`);
  },

  async getAssessment(id) {
    return apiRequest(`/assessments/admin/${id}`);
  },

  async createAssessment(assessmentData) {
    return apiRequest('/assessments/admin', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  async updateAssessment(id, assessmentData) {
    return apiRequest(`/assessments/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    });
  },

  async deleteAssessment(id) {
    return apiRequest(`/assessments/admin/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Update all psychologists with default availability
  async updateAllPsychologistsAvailability() {
    return apiRequest('/admin/availability/update-all', {
      method: 'POST',
    });
  },

  // Add next day availability (daily task)
  async addNextDayAvailability() {
    return apiRequest('/admin/availability/add-next-day', {
      method: 'POST',
    });
  },
  
  // Better Parenting CMS (admin)
  async getBetterParentingPages(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value) queryParams.append(key, value); });
    return apiRequest(`/better-parenting/admin?${queryParams}`);
  },
  async getBetterParentingPage(id) {
    return apiRequest(`/better-parenting/admin/${id}`);
  },
  async createBetterParentingPage(data) {
    return apiRequest('/better-parenting/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateBetterParentingPage(id, data) {
    return apiRequest(`/better-parenting/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteBetterParentingPage(id) {
    return apiRequest(`/better-parenting/admin/${id}`, {
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
    
    return apiRequest(`/sessions/admin/all?${queryParams}`);
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
    return apiRequest(`/availability/public/psychologist/${psychologistId}`);
  },

  // Get psychologist availability range (public)
  async getPsychologistAvailabilityRange(psychologistId, startDate, endDate) {
    return apiRequest(`/availability/psychologist/${psychologistId}/range?startDate=${startDate}&endDate=${endDate}`);
  },

  // Get psychologist packages (public)
  async getPsychologistPackages(psychologistId) {
    return apiRequest(`/public/psychologists/${psychologistId}/packages`);
  },

  // Get single psychologist details (public)
  async getPsychologistDetails(psychologistId) {
    return apiRequest(`/public/psychologists/${psychologistId}/details`);
  },
};

// Messages API
export const messagesApi = {
  // Get user conversations
  async getConversations() {
    return apiRequest('/messages/conversations');
  },

  // Get messages for a conversation
  async getMessages(conversationId) {
    return apiRequest(`/messages/conversations/${conversationId}/messages`);
  },

  // Send a message
  async sendMessage(conversationId, messageData) {
    return apiRequest(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Mark messages as read
  async markAsRead(conversationId) {
    return apiRequest(`/messages/conversations/${conversationId}/read`, {
      method: 'PUT',
    });
  },

  // Create new conversation
  async createConversation(sessionId) {
    return apiRequest('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },
};

// Payment API
export const paymentApi = {
  // Create cash payment
  async createCashPayment(paymentData) {
    return apiRequest('/payment/cash', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Create payment order
  async createPaymentOrder(paymentData) {
    return apiRequest('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Get payment status
  async getPaymentStatus(transactionId) {
    return apiRequest(`/payment/status/${transactionId}`);
  },
};

// Doctors API (for superadmin)
export const doctorsApi = {
  async getAll() {
    return apiRequest('/psychologists');
  },

  async getById(id) {
    return apiRequest(`/psychologists/${id}`);
  },

  async create(doctorData) {
    return apiRequest('/psychologists', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },

  async update(id, doctorData) {
    return apiRequest(`/psychologists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  },

  async delete(id) {
    return apiRequest(`/psychologists/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API (for superadmin)
export const usersApi = {
  async getAll() {
    return apiRequest('/admin/users');
  },

  async getById(id) {
    return apiRequest(`/admin/users/${id}`);
  },

  async create(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async update(id, userData) {
    return apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async delete(id) {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings API (for superadmin)
export const bookingsApi = {
  async getAll() {
    return apiRequest('/admin/sessions');
  },

  async getById(id) {
    return apiRequest(`/sessions/${id}`);
  },

  async create(bookingData) {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async update(id, bookingData) {
    return apiRequest(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  async delete(id) {
    return apiRequest(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Default export with common methods for backward compatibility
export const backendApi = {
  auth: authApi,
  client: clientApi,
  psychologist: psychologistApi,
  admin: adminApi,
  superadmin: superadminApi,
  sessions: sessionsApi,
  dashboard: dashboardApi,
  doctors: doctorsApi,
  users: usersApi,
  bookings: bookingsApi,
  
  // Generic GET method for backward compatibility
  async get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
  },
  
  // Generic POST method for backward compatibility
  async post(endpoint, data) {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Generic PUT method for backward compatibility
  async put(endpoint, data) {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Generic DELETE method for backward compatibility
  async delete(endpoint) {
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  },
};

export default backendApi;
