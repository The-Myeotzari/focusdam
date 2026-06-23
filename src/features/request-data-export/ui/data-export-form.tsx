// 데이터 내보내기 폼

'use client';

import { Download } from 'lucide-react';
import { useState, useTransition } from 'react';

import { requestDataExport } from '../api/request-data-export.action';
import type { DataExportFormat } from '../model/request-data-export.types';

const EXPORT_FORMAT_OPTIONS: Array<{
  label: string;
  value: DataExportFormat;
}> = [
  {
    label: 'CSV',
    value: 'csv',
  },
  {
    label: 'PDF',
    value: 'pdf',
  },
];

export function DataExportForm() {
  const [format, setFormat] = useState<DataExportFormat>('csv');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitExportRequest() {
    setStatusMessage(null);
    startTransition(async () => {
      const result = await requestDataExport({ format });
      setStatusMessage(result.message);
    });
  }

  return (
    <section className="grid gap-4" aria-labelledby="data-export-title">
      <div>
        <h2
          id="data-export-title"
          className="px-1 text-sm font-semibold text-[var(--color-on-surface)]"
        >
          데이터 내보내기
        </h2>
        <p className="mt-1 px-1 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          실제 API 연결 전까지 요청 흐름만 확인합니다.
        </p>
      </div>

      <div className="grid gap-3 rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[var(--shadow-card)]">
        <fieldset className="grid gap-2">
          <legend className="sr-only">내보내기 파일 형식</legend>
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_FORMAT_OPTIONS.map((option) => {
              const isSelected = format === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setFormat(option.value)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)] text-[var(--color-on-surface)]'
                      : 'border-transparent bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          disabled={isPending}
          onClick={submitExportRequest}
          className="site-button site-button--primary w-full gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={18} aria-hidden="true" />
          {isPending ? '요청 중...' : '데이터 내보내기'}
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
