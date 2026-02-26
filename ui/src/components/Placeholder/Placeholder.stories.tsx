import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from './Placeholder';

const meta: Meta<typeof Placeholder> = {
  title: 'Components/Placeholder',
  component: Placeholder,
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Hello from Storybook',
  },
};
