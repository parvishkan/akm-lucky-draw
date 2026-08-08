import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AKM Lucky Draw Error Boundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#0D021A] text-white font-sans text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#1D0636] border-2 border-[#FFD700]/40 space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#FFD700] font-heading">
                Something went wrong
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                An unexpected temporary issue occurred. Don't worry, your token and reward data remain secure.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 mx-auto shadow-gold-glow cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
