import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteSectionTitle } from "./site-section-title";

const meta = {
  title: "Shared/UI/SiteSectionTitle",
  component: SiteSectionTitle,
  parameters: {
    layout: "centered"
  },
  args: {
    eyebrow: "foundation",
    title: "기본 구성",
    description: "섹션 타이틀의 계층과 간격을 확인할 수 있습니다."
  }
} satisfies Meta<typeof SiteSectionTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
