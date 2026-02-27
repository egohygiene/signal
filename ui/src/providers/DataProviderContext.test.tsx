import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DataProvider } from './DataProvider';
import { DataProviderProvider } from './DataProviderContext';
import { useDataProvider } from './useDataProvider';

const mockProvider: DataProvider = {
  getTransactions: () => Promise.resolve([]),
  getCategories: () => Promise.resolve([]),
  getBudgets: () => Promise.resolve([]),
  getPools: () => Promise.resolve([]),
};

function Consumer() {
  const provider = useDataProvider();
  return <span data-testid="has-provider">{String(typeof provider.getTransactions === 'function')}</span>;
}

describe('DataProviderContext', () => {
  it('provides the data provider to children', () => {
    render(
      <DataProviderProvider provider={mockProvider}>
        <Consumer />
      </DataProviderProvider>,
    );
    expect(screen.getByTestId('has-provider')).toHaveTextContent('true');
  });

  it('throws when useDataProvider is used outside DataProviderProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow('useDataProvider must be used within a DataProviderProvider');
    spy.mockRestore();
  });
});
