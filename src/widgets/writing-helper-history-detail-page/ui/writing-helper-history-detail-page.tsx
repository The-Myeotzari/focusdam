'use client';

import Link from 'next/link';
import { ArrowLeft, Clipboard, FileText } from 'lucide-react';

import {
  getWritingHelperHistoryItem,
  type WritingHelperHistoryItem,
} from '@/entities/writing-helper-history';
import { useCopyToClipboard } from '@/shared/lib/use-copy-to-clipboard';
import { SiteToast, SiteToastViewport } from '@/shared/ui';

type WritingHelperHistoryDetailPageProps = {
  id: string;
};

export function WritingHelperHistoryDetailPage({ id }: WritingHelperHistoryDetailPageProps) {
  const item = getWritingHelperHistoryItem(id);
  const {
    copyText,
    resetStatus: resetCopyStatus,
    status: copyStatus,
  } = useCopyToClipboard({
    emptyMessage: '복사할 문장이 없습니다.',
    successMessage: '문장을 복사했습니다.',
  });

  if (!item) {
    return (
      <main className="flex flex-col gap-6 px-5 py-4">
        <Link
          href="/writing-helper"
          className="flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          기록 목록으로
        </Link>
        <section className="grid gap-4 rounded-[32px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <FileText
            size={28}
            aria-hidden="true"
            className="mx-auto text-[var(--color-primary)]"
          />
          <div>
            <h1 className="text-xl font-semibold leading-7 text-[var(--color-on-surface)]">
              기록을 찾을 수 없습니다
            </h1>
            <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
              해당 기록이 없거나 삭제되었을 수 있습니다.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 px-5 py-4">
      <section className="flex flex-col gap-7">
        <Link
          href="/writing-helper"
          className="flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          기록 목록으로
        </Link>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <div>
            <p className="text-xs font-bold uppercase leading-4 tracking-[0.02em] text-[var(--color-primary)]">
              HISTORY DETAIL
            </p>
            <h1 className="mt-1 text-[26px] font-normal leading-[1.35] tracking-[-0.03em] text-[var(--color-on-surface)]">
              {item.input.recipient.trim() || '상대 미입력'}에게 보낼 문장
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
              {formatHistoryDate(item.createdAt)}
            </p>
          </div>

          <div className="mt-5 grid gap-2 rounded-[20px] bg-[var(--color-surface-container-low)] p-4">
            {item.result.summary.map((summary) => {
              return (
                <p key={summary} className="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {summary}
                </p>
              );
            })}
          </div>

          <HistoryTextBlock
            title="조합 초안"
            value={item.result.draftExample}
            onCopy={() => {
              void copyText(item.result.draftExample);
            }}
          />
          <HistoryTextBlock
            title="직접 작성한 문장"
            value={item.editedDraft || '아직 직접 작성한 문장이 없습니다.'}
            onCopy={() => {
              void copyText(item.editedDraft);
            }}
          />

          <SiteToastViewport>
            <SiteToast
              key={copyStatus?.id}
              open={Boolean(copyStatus)}
              variant={copyStatus?.variant}
              description={copyStatus?.message}
              onOpenChange={(open) => {
                if (!open) {
                  resetCopyStatus();
                }
              }}
            />
          </SiteToastViewport>
        </section>
      </section>
    </main>
  );
}

function HistoryTextBlock({
  title,
  value,
  onCopy,
}: {
  title: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="mt-5 grid gap-3 rounded-[20px] bg-[#f4f7fa] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
          {title}
        </h2>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full bg-white text-[var(--color-primary)]"
          aria-label={`${title} 복사`}
          onClick={onCopy}
        >
          <Clipboard size={17} aria-hidden="true" />
        </button>
      </div>
      <p className="whitespace-pre-line text-sm leading-7 text-[var(--color-on-surface)]">
        {value}
      </p>
    </div>
  );
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
