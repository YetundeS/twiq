// Client-side request deduplication utility
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
    this.CACHE_TTL = 30000; // 30 seconds
  }

  // Generate a unique key for the request
  generateKey(url, method = 'GET', body = null) {
    const bodyString = body ? JSON.stringify(body) : '';
    return `${method}:${url}:${btoa(bodyString)}`;
  }

  // Check if request is already pending
  async deduplicate(url, method = 'GET', body = null, fetchFn) {
    const key = this.generateKey(url, method, body);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup();

    // Check if request is already pending
    const existingRequest = this.pendingRequests.get(key);
    
    if (existingRequest && existingRequest.timestamp > now - this.CACHE_TTL) {
      // console.log(`🔄 Deduplicating request: ${method} ${url}`);
      
      try {
        // Return the existing promise
        const result = await existingRequest.promise;
        return { ...result, deduplicated: true };
      } catch (error) {
        // If the original request failed, remove it and allow retry
        this.pendingRequests.delete(key);
        throw error;
      }
    }

    // No pending request, create new one
    const promise = fetchFn();
    
    // Store the promise with metadata
    this.pendingRequests.set(key, {
      promise,
      timestamp: now
    });

    try {
      const result = await promise;
      
      // Keep the result in cache for a short time to handle rapid subsequent requests
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, 1000);
      
      return result;
    } catch (error) {
      // Remove failed request immediately
      this.pendingRequests.delete(key);
      throw error;
    }
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, request] of this.pendingRequests.entries()) {
      if (request.timestamp < now - this.CACHE_TTL) {
        this.pendingRequests.delete(key);
      }
    }
  }

  // Clear all pending requests
  clear() {
    this.pendingRequests.clear();
  }

  // Get stats for debugging
  getStats() {
    return {
      pendingCount: this.pendingRequests.size,
      entries: Array.from(this.pendingRequests.keys())
    };
  }
}

// Global instance
const requestDeduplicator = new RequestDeduplicator();

// Enhanced fetch wrapper with deduplication
export const deduplicatedFetch = async (url, options = {}) => {
  const { method = 'GET', body, ...fetchOptions } = options;
  
  // Only deduplicate GET requests and POST requests with identical payloads
  const shouldDeduplicate = method === 'GET' || (method === 'POST' && body);
  
  if (!shouldDeduplicate) {
    return fetch(url, options);
  }

  return requestDeduplicator.deduplicate(url, method, body, () => {
    return fetch(url, options);
  });
};

// Hook for deduplicating API calls
export const useDeduplicatedFetch = () => {
  return {
    fetch: deduplicatedFetch,
    clear: () => requestDeduplicator.clear(),
    getStats: () => requestDeduplicator.getStats(),
  };
};

// Utility to wrap existing API functions with deduplication
export const withDeduplication = (apiFunction) => {
  return async (...args) => {
    // Create a unique identifier for this API call
    const callId = `${apiFunction.name}:${JSON.stringify(args)}`;
    
    return requestDeduplicator.deduplicate(
      callId,
      'API_CALL',
      args,
      () => apiFunction(...args)
    );
  };
};

export default requestDeduplicator;