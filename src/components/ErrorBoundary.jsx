import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Atelier ErrorBoundary caught error]:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-[#101014] border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white font-heading">
                Storefront Notice
              </h1>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                The storefront could not display this page. Please try again or
                reload.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-left text-[11px] text-red-300/90 font-mono break-all overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 text-xs font-mono tracking-wider uppercase transition-colors"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-full bg-white text-black hover:bg-amber-200 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
