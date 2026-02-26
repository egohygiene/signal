import { type JSX } from 'react';

import type { PlaceholderProps } from './Placeholder.types';

export function Placeholder({ label = 'Placeholder' }: PlaceholderProps): JSX.Element {
  return <div data-testid="placeholder">{label}</div>;
}
