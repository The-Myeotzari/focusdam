'use client';

import { ChevronRight, Trash2 } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/site-dialog';

type Props = {
  className: string;
  description: string;
  title: string;
  toneClassName: string;
};

export function AccountDeleteDialogMenuItem({
  className,
  description,
  title,
  toneClassName,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={className}>
          <span
            className={`grid size-12 shrink-0 place-items-center rounded-full ${toneClassName}`}
            aria-hidden="true"
          >
            <Trash2 size={24} strokeWidth={1.8} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-[var(--color-on-surface)]">
              {title}
            </span>
            <span className="mt-1 block text-sm leading-5 text-[var(--color-on-surface-variant)]">
              {description}
            </span>
          </span>

          <ChevronRight
            size={20}
            className="shrink-0 text-[var(--color-outline)] transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>계정을 삭제할까요?</DialogTitle>
          <DialogDescription>
            계정과 모든 기록이 영구적으로 삭제되며, 삭제 후에는 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <button type="button" className="site-button site-button--secondary">
              취소
            </button>
          </DialogClose>

          {/* TODO: 계정 삭제 API 연결 */}
          <DialogClose asChild>
            <button type="button" className="site-button site-button--danger">
              계정 삭제
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
