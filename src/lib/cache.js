// Simple caching utility for frontend
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cache = {
  // Set cache with expiration
  set(key, data, duration = CACHE_DURATION) {
    const item = {
      data,
      timestamp: Date.now(),
      duration
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  // Get cache if not expired
  get(key) {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - parsed.timestamp > parsed.duration) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // Clear specific cache
  clear(key) {
    localStorage.removeItem(`cache_${key}`);
  },

  // Clear all cache
  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Check if cache exists and is valid
  has(key) {
    return this.get(key) !== null;
  }
};

// Cache wrapper for API calls
export const withCache = (apiCall, cacheKey, duration = CACHE_DURATION) => {
  return async (...args) => {
    // Try to get from cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for ${cacheKey}`);
      return cached;
    }

    // If not in cache, make API call
    console.log(`🌐 Cache miss for ${cacheKey}, making API call`);
    try {
      const result = await apiCall(...args);
      cache.set(cacheKey, result, duration);
      return result;
    } catch (error) {
      console.error(`API call failed for ${cacheKey}:`, error);
      throw error;
    }
  };
};
