import { type JSX } from 'react';

export interface PlaceholderProps {
  label?: string;
}

export function Placeholder({ label = 'Placeholder' }: PlaceholderProps): JSX.Element {
  return <div data-testid="placeholder">{label}</div>;
}
