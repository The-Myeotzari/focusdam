import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteInput } from "./site-input";

const meta = {
  title: "Shared/UI/SiteInput",
  component: SiteInput,
  parameters: {
    layout: "centered"
  },
  args: {
    placeholder: "오늘의 한 줄"
  }
} satisfies Meta<typeof SiteInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "비활성 상태"
  }
};
