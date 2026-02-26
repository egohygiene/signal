import { render, screen } from '@testing-library/react';

import { Placeholder } from './Placeholder';

describe('Placeholder', () => {
  it('renders with default label', () => {
    render(<Placeholder />);
    expect(screen.getByTestId('placeholder')).toHaveTextContent('Placeholder');
  });

  it('renders with a custom label', () => {
    render(<Placeholder label="Hello" />);
    expect(screen.getByTestId('placeholder')).toHaveTextContent('Hello');
  });
});
