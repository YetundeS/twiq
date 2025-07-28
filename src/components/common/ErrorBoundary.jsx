import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      eventId: Date.now().toString()
    });

    // Log to external service (optional)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { fallback: Fallback, showDetails = false } = this.props;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            eventId={this.state.eventId}
            onReset={this.handleReset}
            onReload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {showDetails && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <div className="error-stack">
                  <p><strong>Error:</strong> {this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="btn btn-secondary"
              >
                Reload Page
              </button>
            </div>
            
            {this.state.eventId && (
              <p className="error-id">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error, errorInfo = {}) => {
    console.error('Error caught by useErrorHandler:', error);
    setError({ error, errorInfo, timestamp: Date.now() });
  }, []);

  // Throw error to be caught by ErrorBoundary
  React.useEffect(() => {
    if (error) {
      throw error.error;
    }
  }, [error]);

  return { handleError, resetError, error };
};

// HOC to wrap components with error boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = React.forwardRef((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Specific error boundary for async operations
export const AsyncErrorBoundary = ({ children, onError, fallback }) => {
  const [asyncError, setAsyncError] = React.useState(null);

  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAsyncError(event.reason);
      if (onError) onError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  if (asyncError) {
    if (fallback) {
      return fallback(asyncError, () => setAsyncError(null));
    }
    
    return (
      <div className="async-error">
        <h3>Network or Server Error</h3>
        <p>Failed to load data: {asyncError.message}</p>
        <button onClick={() => setAsyncError(null)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;