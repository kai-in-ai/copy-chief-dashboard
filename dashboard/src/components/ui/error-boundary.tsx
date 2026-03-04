'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="border border-red-500/30 rounded p-3 bg-red-500/5">
          <p className="text-[10px] font-mono text-red-400">
            {this.props.section ? `[${this.props.section}] ` : ''}
            Error: {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="text-[10px] font-mono text-[var(--hud-accent)] underline mt-1"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
