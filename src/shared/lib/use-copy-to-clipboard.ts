'use client';

import { useCallback, useState } from 'react';

type CopyToClipboardStatus = {
  id: number;
  message: string;
  variant: 'success' | 'error';
};

type UseCopyToClipboardOptions = {
  emptyMessage?: string;
  errorMessage?: string;
  successMessage?: string;
};

type CopyToClipboardResult = {
  ok: boolean;
  message: string;
  variant: CopyToClipboardStatus['variant'];
};

export function useCopyToClipboard({
  emptyMessage = '복사할 내용이 없습니다.',
  errorMessage = '복사하지 못했습니다.',
  successMessage = '복사했습니다.',
}: UseCopyToClipboardOptions = {}) {
  const [status, setStatus] = useState<CopyToClipboardStatus | null>(null);

  const resetStatus = useCallback(() => {
    setStatus(null);
  }, []);

  const setCopyStatus = useCallback((message: string, variant: CopyToClipboardStatus['variant']) => {
    setStatus({
      id: Date.now(),
      message,
      variant,
    });

    return {
      ok: variant === 'success',
      message,
      variant,
    } satisfies CopyToClipboardResult;
  }, []);

  const copyText = useCallback(
    async (value: string) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        return setCopyStatus(emptyMessage, 'error');
      }

      if (!navigator.clipboard?.writeText) {
        return setCopyStatus(errorMessage, 'error');
      }

      try {
        await navigator.clipboard.writeText(trimmedValue);

        return setCopyStatus(successMessage, 'success');
      } catch {
        return setCopyStatus(errorMessage, 'error');
      }
    },
    [emptyMessage, errorMessage, setCopyStatus, successMessage],
  );

  return {
    copyText,
    resetStatus,
    status,
  };
}
