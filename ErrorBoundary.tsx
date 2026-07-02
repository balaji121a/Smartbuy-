import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level React error boundary.
 *
 * Without this, any uncaught render error (a bad API response shape, a
 * third-party component throwing, etc.) crashes the entire app to a blank
 * white screen with nothing but a console error. This catches that,
 * logs it, and shows the user a recoverable fallback UI instead.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real deployment, forward this to an error-tracking service
    // (Sentry, LogRocket, etc.) instead of just logging it.
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-sm w-full text-center bg-white rounded-2xl border border-zinc-150 shadow-sm p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-black text-zinc-900">Something went wrong</h2>
            <p className="text-xs text-zinc-400 mt-1">
              An unexpected error occurred while rendering this page. You can try reloading the app.
            </p>
            <button
              onClick={this.handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2874F0] px-6 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
