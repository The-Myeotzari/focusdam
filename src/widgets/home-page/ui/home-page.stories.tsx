import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomePage } from "./home-page";

const meta = {
  title: "Widgets/HomePage",
  component: HomePage
} satisfies Meta<typeof HomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
