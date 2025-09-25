import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging for Learnio
    console.error('🔴 Learnio ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Store error info for detailed display
    this.setState({
      error,
      errorInfo
    });

    // Optional: Send error to analytics/monitoring service
    // this.reportError(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Enhanced error UI for Learnio with better UX
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full border border-red-100">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                We're sorry, but there was an error in Learnio. Don't worry, your progress is safe!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleRetry}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Restart Learnio
              </button>
            </div>

            {/* Error Details (Collapsible) */}
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer font-medium hover:text-gray-700 transition-colors">
                🔧 Technical Details (for developers)
              </summary>
              <div className="mt-3 space-y-2">
                {this.state.error && (
                  <div>
                    <p className="font-medium text-gray-700">Error:</p>
                    <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo && (
                  <div>
                    <p className="font-medium text-gray-700">Component Stack:</p>
                    <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto max-h-32 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700">Timestamp:</p>
                  <p className="text-xs bg-gray-100 p-2 rounded border">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </details>

            {/* Helpful Message */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> If this keeps happening, try clearing your browser cache or contact support. Your learning progress is automatically saved!
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}