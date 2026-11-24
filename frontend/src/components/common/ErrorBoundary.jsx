import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg rounded-2xl border border-red-500/30 bg-[#0b1329] p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Application Render Error
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-black/40 p-3 text-left font-mono text-[11px] text-red-300/80">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={this.handleReset}
              >
                Reload Workspace
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

