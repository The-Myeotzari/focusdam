import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteBadge, SiteCard } from "./index";

const meta = {
  title: "Shared/UI/SiteCard",
  component: SiteCard,
  parameters: {
    layout: "centered"
  },
  args: {
    children: (
      <div className="site-stack" style={{ width: 320 }}>
        <SiteBadge tone="primary">card</SiteBadge>
        <h2 className="site-title-md">카드 제목</h2>
        <p className="site-body-md">디자인 시스템의 카드 스타일을 확인하는 예시입니다.</p>
      </div>
    )
  }
} satisfies Meta<typeof SiteCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoPadding: Story = {
  args: {
    padded: false,
    children: (
      <div style={{ width: 320, padding: 24 }}>
        <p className="site-body-md">패딩 없는 상태도 확인할 수 있습니다.</p>
      </div>
    )
  }
};
