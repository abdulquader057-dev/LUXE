"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by Luxe ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 my-6 rounded-[28px] bg-red-950/20 border border-red-500/20 backdrop-blur-xl max-w-xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
            <ShieldAlert size={22} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-white uppercase">
              Widget Engine Exception
            </h3>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
              An error occurred during component compilation or state mutation.
            </p>
          </div>

          {this.state.error && (
            <pre className="text-[8px] font-mono bg-black/40 border border-white/5 p-3 rounded-lg overflow-x-auto text-red-400 max-w-full text-left">
              {this.state.error.toString()}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            className="px-6 py-3 border border-red-500/30 hover:border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[9px] font-mono font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw size={12} /> Reset Protocol
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
