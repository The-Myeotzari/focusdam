import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExampleHomePage } from '../../example/ui/example-home-page';

const meta = {
  title: 'Widgets/HomePage',
  component: ExampleHomePage,
} satisfies Meta<typeof ExampleHomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
