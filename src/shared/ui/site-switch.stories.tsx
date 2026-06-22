'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { SiteSwitch } from './site-switch';

function SwitchExample() {
  const [checked, setChecked] = useState(true);

  return (
    <SiteSwitch
      checked={checked}
      label="알림 설정"
      onCheckedChange={setChecked}
    />
  );
}

const meta = {
  title: 'Shared/UI/SiteSwitch',
  component: SiteSwitch,
  parameters: {
    layout: 'centered',
  },
  args: {
    checked: true,
    label: '알림 설정',
    onCheckedChange: () => undefined,
  },
} satisfies Meta<typeof SiteSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SwitchExample />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
