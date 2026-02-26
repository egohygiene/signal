import '../../i18n';

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './Layout';

function renderLayout(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Home Content</div>} />
          <Route path="/transactions" element={<div>Transactions Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders the navigation', () => {
    renderLayout();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderLayout();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Transactions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Budgets' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pools' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders the main content container', () => {
    renderLayout();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders route content inside the main container', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Home Content'));
  });

  it('renders different route content without breaking navigation', () => {
    renderLayout('/transactions');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Transactions Content')).toBeInTheDocument();
  });
});
