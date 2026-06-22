import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './site-dialog';

const meta = {
  title: 'Shared/UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="site-button site-button--primary">
          Dialog 열기
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>계정을 삭제할까요?</DialogTitle>
          <DialogDescription>
            계정을 삭제하면 모든 기록이 사라지며 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <button type="button" className="site-button site-button--secondary">
              취소
            </button>
          </DialogClose>
          <button type="button" className="site-button site-button--primary">
            확인
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="site-button site-button--outline">
          닫기 버튼 없는 Dialog
        </button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>알림</DialogTitle>
          <DialogDescription>하단 버튼을 눌러 Dialog를 닫을 수 있습니다.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <button type="button" className="site-button site-button--primary">
              확인
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
