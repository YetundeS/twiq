'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ChevronDown, Copy, RefreshCw, RotateCcw } from 'lucide-react';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null,
      retrying: false,
      reloading: false
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
    this.setState({ reloading: true });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  handleReset = () => {
    this.setState({ retrying: true });
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        eventId: null,
        retrying: false,
        reloading: false
      });
    }, 500);
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
        <div className="flex min-h-[400px] h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20" role="alert" aria-live="assertive">
          <Card className="error-boundary-animate mx-auto w-full max-w-lg border-destructive/20 bg-card/80 backdrop-blur-md shadow-2xl dark:bg-card/60 dark:shadow-2xl ring-1 ring-white/10 dark:ring-white/5">
            <CardHeader className="text-center relative">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 text-destructive dark:from-destructive/30 dark:to-destructive/20 animate-pulse shadow-lg" aria-hidden="true">
                <AlertTriangle className="size-8 drop-shadow-sm" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text" id="error-title">
                Something went wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground leading-relaxed" id="error-description" aria-describedby="error-title">
                We encountered an unexpected error while loading this content. This is likely a temporary issue that can be resolved by refreshing the page. If the problem continues, please contact our support team for assistance.
              </p>
              
              {showDetails && this.state.error && (
                <ErrorDetails 
                  error={this.state.error} 
                  errorInfo={this.state.errorInfo}
                />
              )}
              
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center" role="group" aria-label="Error recovery actions">
                <Button 
                  onClick={this.handleReset}
                  className={`flex items-center gap-2 transition-all hover:scale-105 ${this.state.retrying ? 'error-retry-loading' : ''}`}
                  variant="default"
                  disabled={this.state.retrying || this.state.reloading}
                  aria-describedby="error-description"
                  aria-label={this.state.retrying ? 'Retrying to recover from error' : 'Try to recover from error without reloading the page'}
                >
                  <RotateCcw className={`size-4 ${this.state.retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
                  {this.state.retrying ? 'Retrying...' : 'Try Again'}
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className={`flex items-center gap-2 transition-all hover:scale-105 ${this.state.reloading ? 'error-retry-loading' : ''}`}
                  disabled={this.state.retrying || this.state.reloading}
                  aria-describedby="error-description"
                  aria-label={this.state.reloading ? 'Reloading the entire page' : 'Reload the entire page to recover from error'}
                >
                  <RefreshCw className={`size-4 ${this.state.reloading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  {this.state.reloading ? 'Reloading...' : 'Reload Page'}
                </Button>
              </div>
              
              {this.state.eventId && (
                <div className="rounded-lg bg-gradient-to-r from-muted/30 to-muted/20 border border-muted-foreground/20 p-3 text-center backdrop-blur-sm ring-1 ring-white/5">
                  <p className="text-xs text-muted-foreground font-mono bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text">
                    Error ID: {this.state.eventId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Details Component
const ErrorDetails = ({ error, errorInfo }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const errorText = `Error: ${error.toString()}\n\nComponent Stack:\n${errorInfo?.componentStack || 'No component stack available'}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 dark:bg-destructive/10" role="region" aria-labelledby="error-details-toggle">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-destructive/10 dark:hover:bg-destructive/15 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls="error-details-content"
        id="error-details-toggle"
      >
        <span>Error Details</span>
        <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      
      {isExpanded && (
        <div className="border-t border-destructive/20 p-4" id="error-details-content">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Technical Information</span>
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="sm"
              className="h-8 px-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={copied ? 'Error details copied to clipboard' : 'Copy error details to clipboard'}
            >
              {copied ? (
                <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              <span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          
          <div className="rounded-md bg-muted/50 p-3 font-mono text-xs">
            <div className="mb-2">
              <span className="font-semibold text-destructive">Error:</span>
              <p className="mt-1 text-foreground">{error.toString()}</p>
            </div>
            
            {errorInfo?.componentStack && (
              <div>
                <span className="font-semibold text-destructive">Component Stack:</span>
                <pre className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20" role="alert" aria-live="assertive">
        <Card className="error-boundary-animate w-full max-w-md border-destructive/20 bg-card/80 backdrop-blur-md shadow-xl dark:bg-card/60 ring-1 ring-white/10 dark:ring-white/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 text-destructive dark:from-destructive/30 dark:to-destructive/20 shadow-lg" aria-hidden="true">
              <AlertTriangle className="size-6 drop-shadow-sm" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text" id="async-error-title">
              Network or Server Error
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground text-sm leading-relaxed" id="async-error-description" aria-describedby="async-error-title">
              Failed to load data: {asyncError.message}. This is usually a temporary network issue that can be resolved by trying again.
            </p>
            
            <Button 
              onClick={() => setAsyncError(null)}
              className="w-full flex items-center gap-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              variant="default"
              aria-describedby="async-error-description"
              aria-label="Retry loading the data"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Try Again
            </Button>
          </CardContent>
        </Card>
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