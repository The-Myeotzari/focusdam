import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteButton } from "./site-button";

const meta = {
  title: "Shared/UI/SiteButton",
  component: SiteButton,
  args: {
    href: "#",
    children: "Button",
    variant: "primary"
  }
} satisfies Meta<typeof SiteButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline"
  }
};
