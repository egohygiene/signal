import { logger } from '@egohygiene/signal/logging';
import { type ErrorInfo, type JSX, type ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  resetKeys?: unknown[];
};

function handleError(error: Error, info: ErrorInfo): void {
  logger.error({ err: error, componentStack: info.componentStack }, 'ErrorBoundary caught an error');
}

/**
 * ErrorBoundary catches unhandled render errors in its subtree and renders a
 * minimal fallback UI instead of crashing the whole page.
 *
 * Pass `resetKeys` (e.g. `[pathname]`) to automatically reset the boundary
 * when the value changes, such as on navigation.
 */
export function ErrorBoundary({ children, fallback, resetKeys }: ErrorBoundaryProps): JSX.Element {
  return (
    <ReactErrorBoundary
      fallback={fallback ?? <p role="alert">Something went wrong.</p>}
      onError={handleError}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}
