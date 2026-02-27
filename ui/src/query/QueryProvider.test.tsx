import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QueryProvider } from './QueryProvider';

function QueryClientConsumer() {
  const client = useQueryClient();
  const defaults = client.getDefaultOptions().queries;
  return (
    <div>
      <span data-testid="stale-time">{String(defaults?.staleTime)}</span>
      <span data-testid="retry">{String(defaults?.retry)}</span>
      <span data-testid="refetch-on-window-focus">
        {String(defaults?.refetchOnWindowFocus)}
      </span>
    </div>
  );
}

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <span data-testid="child">hello</span>
      </QueryProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides a query client with sensible defaults', () => {
    render(
      <QueryProvider>
        <QueryClientConsumer />
      </QueryProvider>,
    );
    expect(screen.getByTestId('stale-time')).toHaveTextContent('300000');
    expect(screen.getByTestId('retry')).toHaveTextContent('1');
    expect(screen.getByTestId('refetch-on-window-focus')).toHaveTextContent(
      'false',
    );
  });
});
