import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteBadge } from "./site-badge";

const meta = {
  title: "Shared/UI/SiteBadge",
  component: SiteBadge,
  args: {
    children: "primary",
    tone: "primary"
  }
} satisfies Meta<typeof SiteBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Success: Story = {
  args: {
    children: "success",
    tone: "success"
  }
};

export const Caution: Story = {
  args: {
    children: "caution",
    tone: "caution"
  }
};

export const Premium: Story = {
  args: {
    children: "premium",
    tone: "premium"
  }
};
