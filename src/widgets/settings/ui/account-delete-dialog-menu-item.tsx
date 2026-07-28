'use client';

import { ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function deleteAccount() {
    if (confirmation !== '계정 삭제' || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(body?.detail ?? '계정을 삭제하지 못했습니다.');
      }

      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.replace('/?account_deleted=1');
    } catch (error) {
      console.error(error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : '계정을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
      setIsDeleting(false);
    }
  }

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

        <label className="grid gap-2 text-sm font-semibold text-[var(--color-on-surface)]">
          확인을 위해 아래에 “계정 삭제”를 입력해 주세요.
          <input
            type="text"
            value={confirmation}
            disabled={isDeleting}
            autoComplete="off"
            onChange={(event) => setConfirmation(event.target.value)}
            className="h-12 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-4 font-medium outline-none focus:border-[var(--ds-safety-ink)]"
            placeholder="계정 삭제"
          />
        </label>

        <p
          role={deleteError ? 'alert' : undefined}
          aria-live="polite"
          className="min-h-5 text-sm font-medium text-[var(--ds-safety-ink)]"
        >
          {deleteError}
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              disabled={isDeleting}
              className="site-button site-button--secondary"
            >
              취소
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={confirmation !== '계정 삭제' || isDeleting}
            onClick={() => void deleteAccount()}
            className="site-button site-button--danger disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '계정 영구 삭제'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
