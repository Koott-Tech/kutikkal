const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const staffApi = {
  // Get staff dashboard overview
  async getDashboard(staffId) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/dashboard/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  // Get staff sessions by date range
  async getSessions(staffId, { startDate, endDate, status } = {}) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (status) params.append('status', status);

      const response = await fetch(`${API_BASE_URL}/staff/sessions/${staffId}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  // Get staff availability
  async getAvailability(staffId) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/availability/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // Update staff availability
  async updateAvailability(staffId, availability) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/availability/${staffId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability }),
      });
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },

  // Add session notes/report
  async addSessionNotes(sessionId, notes) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/sessions/${sessionId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notes),
      });
      if (!response.ok) {
        throw new Error('Failed to add session notes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding session notes:', error);
      throw error;
    }
  },

  // Update session status
  async updateSessionStatus(sessionId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update session status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating session status:', error);
      throw error;
    }
  },

  // Get staff profile
  async getProfile(staffId) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/profile/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update staff profile
  async updateProfile(staffId, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/profile/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

