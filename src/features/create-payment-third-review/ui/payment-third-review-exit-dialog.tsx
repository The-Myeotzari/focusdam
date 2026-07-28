'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/site-dialog';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PaymentThirdReviewExitDialog({ open, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>작성을 그만두고 나갈까요?</DialogTitle>
          <DialogDescription>
            페이지를 나가면 지금까지 입력한 내용이 사라지며 복구할 수 없어요.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button type="button" className="site-button site-button--primary" onClick={onCancel}>
            계속 작성
          </button>
          <button type="button" className="site-button site-button--danger" onClick={onConfirm}>
            나가기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
