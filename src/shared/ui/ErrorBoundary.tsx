import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** What to show instead of the crashed part. */
  fallback: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = { failed: boolean };

/**
 * Catches a crash in ONE part of a screen (e.g. the 3D viewer on a phone whose GPU
 * can't handle it) and shows a fallback, while the rest of the screen keeps working.
 * React only supports this with a class component.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
