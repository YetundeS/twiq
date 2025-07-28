import useSWR from 'swr';
import { addAuthHeader } from '@/lib/utils';
import { toast } from 'sonner';

// Enhanced fetcher with compression, rate limiting, and error handling
const fetcher = async (url) => {
  const authHeader = addAuthHeader();
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      ...authHeader,
    },
  });

  // Handle rate limiting
  const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
  if (rateLimitRemaining && parseInt(rateLimitRemaining) < 5) {
    toast.warning(`Rate limit approaching`, {
      description: `${rateLimitRemaining} requests remaining`,
      style: {
        border: "none",
        color: "orange",
      },
    });
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const error = new Error(`Rate limited. Please wait ${retryAfter ? Math.ceil(retryAfter / 60) + ' minutes' : 'a moment'}`);
    error.status = 429;
    error.retryAfter = retryAfter;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('Failed to fetch');
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  return response.json();
};

// Hook for fetching chat sessions with caching
export const useChatSessions = (userId, assistantSlug, options = {}) => {
  const {
    page = 1,
    limit = 20,
    enabled = true,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const key = enabled && userId && assistantSlug
    ? `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/?userId=${userId}&assistantSlug=${assistantSlug}&page=${page}&limit=${limit}`
    : null;

  const { data, error, mutate, isLoading } = useSWR(
    key,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      onError: (error) => {
        if (error.status === 429) {
          toast.error('Rate limited', {
            description: error.message,
            style: { border: "none", color: "red" },
          });
        } else if (error.statusText?.includes('Unauthorized')) {
          toast.error('Unauthorized', {
            description: 'Please log in again',
            style: { border: "none", color: "red" },
          });
        } else {
          toast.error('Failed to fetch sessions', {
            description: 'Something went wrong - please try again',
            style: { border: "none", color: "red" },
          });
        }
      },
    }
  );

  return {
    sessions: data?.data || data || [],
    pagination: data?.pagination,
    hasMore: data?.pagination?.hasMore || false,
    error,
    isLoading,
    mutate,
  };
};

// Hook for fetching chat messages with caching
export const useChatMessages = (sessionId, assistantSlug, options = {}) => {
  const {
    page = 1,
    limit = 50,
    enabled = true,
    refreshInterval = 0, // Don't auto-refresh messages
  } = options;

  const key = enabled && sessionId && assistantSlug
    ? `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/fetch/${sessionId}?assistantSlug=${assistantSlug}&page=${page}&limit=${limit}`
    : null;

  const { data, error, mutate, isLoading } = useSWR(
    key,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 2000, // Shorter deduping for messages
      errorRetryCount: 2,
      errorRetryInterval: 1500,
      onError: (error) => {
        if (error.status === 429) {
          toast.error('Rate limited', {
            description: error.message,
            style: { border: "none", color: "red" },
          });
        } else if (error.statusText?.includes('Unauthorized')) {
          toast.error('Unauthorized', {
            description: 'Please log in again',
            style: { border: "none", color: "red" },
          });
        } else {
          toast.error('Failed to fetch messages', {
            description: 'Something went wrong - please try again',
            style: { border: "none", color: "red" },
          });
        }
      },
    }
  );

  return {
    messages: data?.messages || data || [],
    pagination: data?.pagination,
    hasMore: data?.pagination?.hasMore || false,
    error,
    isLoading,
    mutate,
  };
};

// Hook for user profile data with caching
export const useUserProfile = (userId, enabled = true) => {
  const key = enabled && userId
    ? `${process.env.NEXT_PUBLIC_SERVER_URI}/user/profile/${userId}`
    : null;

  const { data, error, mutate, isLoading } = useSWR(
    key,
    fetcher,
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
      errorRetryCount: 2,
    }
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
  };
};

// Utility to preload data
export const preloadChatSessions = (userId, assistantSlug, page = 1, limit = 20) => {
  const key = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/?userId=${userId}&assistantSlug=${assistantSlug}&page=${page}&limit=${limit}`;
  return mutate(key, fetcher(key), false);
};

export const preloadChatMessages = (sessionId, assistantSlug, page = 1, limit = 50) => {
  const key = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/fetch/${sessionId}?assistantSlug=${assistantSlug}&page=${page}&limit=${limit}`;
  return mutate(key, fetcher(key), false);
};

// Global mutate function for cache invalidation
export { mutate } from 'swr';