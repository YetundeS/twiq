import { toast } from 'sonner';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Classify error based on status code and message
 */
export const classifyError = (error, response = null) => {
  // Network errors
  if (!navigator.onLine) {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      message: 'No internet connection',
      retryable: true
    };
  }

  // Response-based classification
  if (response) {
    const status = response.status;
    
    if (status === 401) {
      return {
        type: ERROR_TYPES.AUTHENTICATION,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Authentication required - please log in again',
        retryable: false
      };
    }
    
    if (status === 403) {
      return {
        type: ERROR_TYPES.AUTHORIZATION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: 'Access denied - insufficient permissions',
        retryable: false
      };
    }
    
    if (status === 429) {
      return {
        type: ERROR_TYPES.RATE_LIMIT,
        severity: ERROR_SEVERITY.MEDIUM,
        message: 'Too many requests - please wait before trying again',
        retryable: true
      };
    }
    
    if (status >= 400 && status < 500) {
      return {
        type: ERROR_TYPES.CLIENT,
        severity: ERROR_SEVERITY.MEDIUM,
        message: 'Invalid request - please check your input',
        retryable: false
      };
    }
    
    if (status >= 500) {
      return {
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Server error - please try again later',
        retryable: true
      };
    }
  }

  // Error message-based classification
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('connection')) {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      message: 'Network connection failed',
      retryable: true
    };
  }
  
  if (errorMessage.includes('unauthorized') || 
      errorMessage.includes('authentication')) {
    return {
      type: ERROR_TYPES.AUTHENTICATION,
      severity: ERROR_SEVERITY.HIGH,
      message: 'Authentication failed',
      retryable: false
    };
  }
  
  if (errorMessage.includes('validation') || 
      errorMessage.includes('invalid')) {
    return {
      type: ERROR_TYPES.VALIDATION,
      severity: ERROR_SEVERITY.MEDIUM,
      message: 'Validation failed',
      retryable: false
    };
  }

  // Default classification
  return {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    message: error?.message || 'An unexpected error occurred',
    retryable: true
  };
};

/**
 * Handle errors with appropriate user feedback
 */
export const handleError = (error, context = {}, options = {}) => {
  const {
    showToast = true,
    logError = true,
    throwError = false,
    customMessage = null,
    retryAction = null
  } = options;

  const classification = classifyError(error, context.response);
  const errorId = Date.now().toString();

  // Log error
  if (logError) {
    console.error(`[${errorId}] Error in ${context.component || 'Unknown'}:`, {
      error,
      classification,
      context
    });
  }

  // Show user-friendly toast notification
  if (showToast) {
    const message = customMessage || classification.message;
    const toastOptions = {
      id: errorId,
      style: { border: "none", color: "red" }
    };

    // Add retry action if available and error is retryable
    if (retryAction && classification.retryable) {
      toastOptions.action = {
        label: 'Retry',
        onClick: retryAction
      };
    }

    switch (classification.severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        toast.error(message, toastOptions);
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.warning(message, toastOptions);
        break;
      case ERROR_SEVERITY.LOW:
        toast.info(message, toastOptions);
        break;
    }
  }

  // Throw error if requested (for error boundaries)
  if (throwError) {
    const enhancedError = new Error(classification.message);
    enhancedError.originalError = error;
    enhancedError.classification = classification;
    enhancedError.errorId = errorId;
    enhancedError.context = context;
    throw enhancedError;
  }

  return {
    error,
    classification,
    errorId,
    handled: true
  };
};

/**
 * Retry logic with exponential backoff
 */
export const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => classifyError(error).retryable
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if condition is not met
      if (!retryCondition(error)) {
        break;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      // console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Global error handler for unhandled errors
 */
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    handleError(event.reason, {
      component: 'Global',
      type: 'unhandledrejection'
    }, {
      customMessage: 'An unexpected error occurred. Please refresh the page if problems persist.'
    });
    
    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle runtime errors
  window.addEventListener('error', (event) => {
    console.error('Runtime error:', event.error);
    
    handleError(event.error, {
      component: 'Global',
      type: 'runtime',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }, {
      customMessage: 'A system error occurred. Please refresh the page if problems persist.'
    });
  });
};

/**
 * API error handler specifically for fetch requests
 */
export const handleApiError = async (response, context = {}) => {
  let errorData;
  
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText || 'Unknown error' };
  }

  const error = new Error(errorData.message || `API Error: ${response.status}`);
  error.status = response.status;
  error.data = errorData;

  return handleError(error, {
    ...context,
    response,
    url: response.url
  });
};

/**
 * Hook for handling errors in React components
 */
export const useErrorHandler = (componentName) => {
  return React.useCallback((error, additionalContext = {}) => {
    return handleError(error, {
      component: componentName,
      ...additionalContext
    });
  }, [componentName]);
};

export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  classifyError,
  handleError,
  withRetry,
  setupGlobalErrorHandling,
  handleApiError,
  useErrorHandler
};