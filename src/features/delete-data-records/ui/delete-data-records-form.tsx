'use client';

import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { SiteInput } from '@/shared/ui';

import { deleteDataRecords } from '../api/delete-data-records.action';

export function DeleteDataRecordsForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isSubmitDisabled = isPending || !startDate || !endDate;

  function submitDeleteRequest() {
    setStatusMessage(null);
    startTransition(async () => {
      const result = await deleteDataRecords({
        startDate,
        endDate,
      });

      setStatusMessage(result.message);
    });
  }

  return (
    <section className="grid gap-4" aria-labelledby="data-delete-title">
      <div>
        <h2
          id="data-delete-title"
          className="px-1 text-sm font-semibold text-[var(--color-on-surface)]"
        >
          기록 삭제
        </h2>
        <p className="mt-1 px-1 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          삭제할 데이터 기간을 선택합니다.
        </p>
      </div>

      <div className="grid gap-4 rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-xs font-semibold text-[var(--color-on-surface-variant)]">
            시작일
            <SiteInput
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-xs font-semibold text-[var(--color-on-surface-variant)]">
            종료일
            <SiteInput
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={submitDeleteRequest}
          className="min-h-12 rounded-[var(--radius-xl)] text-sm font-semibold text-[var(--ds-safety-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} className="mr-1 inline-block" aria-hidden="true" />
          {isPending ? '요청 중...' : '기록 삭제 요청'}
        </button>

        <p
          aria-live="polite"
          className="min-h-5 text-center text-xs text-[var(--color-on-surface-variant)]"
        >
          {statusMessage}
        </p>
      </div>
    </section>
  );
}
