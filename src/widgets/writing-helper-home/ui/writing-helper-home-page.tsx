'use client';

import Link from 'next/link';
import { FileText, PenLine, Sparkles } from 'lucide-react';

import {
  listWritingHelperHistoryItems,
  type WritingHelperHistoryItem,
} from '@/entities/writing-helper-history';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';
import { SiteBadge, SiteButton, SiteCard, SiteTopBar } from '@/shared/ui';

const HISTORY_PAGE_SIZE = 4;

export function WritingHelperHomePage() {
  const items = listWritingHelperHistoryItems();

  return (
    <>
      <SiteTopBar title="문장 교정" backHref="/" skipHref="#writing-history" />
      <main className="flex flex-col gap-5 px-5 pb-8 pt-4">
        <WritingHelperHero />
        <WritingHelperHistoryPreview items={items} />
      </main>
    </>
  );
}

function WritingHelperHero() {
  return (
    <section aria-labelledby="writing-helper-title">
      <SiteCard
        padded={false}
        className="relative overflow-hidden !rounded-[28px] !border !border-[#c2c7ce33] !bg-white !p-5 !shadow-[0_16px_34px_rgba(60,95,124,0.09)]"
      >
        <div className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#e8f5f1] text-[#2d6a4f]">
          <Sparkles size={22} strokeWidth={2} aria-hidden="true" />
        </div>

        <SiteBadge tone="success" className="!bg-[#e8f5f1] !text-[#2d6a4f]">
          글쓰기 도움
        </SiteBadge>

        <h1
          id="writing-helper-title"
          className="mt-4 text-[26px] font-semibold leading-[1.32] tracking-[-0.01em] text-[#1a1c1e]"
        >
          막힌 문장을
          <br />
          핵심부터 정리해요
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          상대, 이유, 핵심 내용을 짧게 적고 바로 보낼 수 있는 문장 흐름을 만들어보세요.
        </p>

        <div className="mt-5">
          <SiteButton
            href="/writing-helper/create"
            className="!min-h-[52px] !w-full !gap-2 !px-6 !text-sm !font-semibold"
          >
            <PenLine size={17} aria-hidden="true" />
            문장 작성하기
          </SiteButton>
        </div>
      </SiteCard>
    </section>
  );
}

function WritingHelperHistoryPreview({ items }: { items: WritingHelperHistoryItem[] }) {
  const { hasMore, loadMoreRef, visibleItems } = useInfiniteScroll({
    items,
    pageSize: HISTORY_PAGE_SIZE,
  });

  return (
    <section id="writing-history" aria-labelledby="writing-history-title" className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 id="writing-history-title" className="text-lg font-semibold leading-7 text-[#1a1c1e]">
          최근 문장 교정
        </h2>
        <SiteButton
          href="/writing-helper/create"
          variant="secondary"
          className="!min-h-9 !rounded-full !bg-transparent !px-1 !text-xs !font-semibold !text-[#72777e] !shadow-none"
        >
          새로 작성
        </SiteButton>
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid gap-2">
            {visibleItems.map((item) => {
              return <WritingHelperHistoryRow key={item.id} item={item} />;
            })}
          </div>

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="min-h-11 rounded-full bg-[#ebeaf0] px-4 py-2.5 text-center text-sm font-semibold leading-6 text-[#72777e]"
            >
              다음 문장 교정을 불러오는 중
            </div>
          ) : null}
        </>
      ) : (
        <div className="grid gap-4 rounded-[20px] bg-white p-5 text-center shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <FileText
            size={28}
            aria-hidden="true"
            className="mx-auto text-[var(--color-primary)]"
          />
          <div>
            <h3 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
              아직 작성 기록이 없습니다
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
              문장 작성하기를 누르면 최근 기록이 이곳에 표시됩니다.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function WritingHelperHistoryRow({ item }: { item: WritingHelperHistoryItem }) {
  const preview = item.editedDraft.trim() || item.result.draftExample;
  const isEdited = Boolean(item.editedDraft.trim());

  return (
    <Link
      href={`/writing-helper/history/${item.id}`}
      className="grid gap-2 rounded-[18px] border border-[#c2c7ce33] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(60,95,124,0.06)] transition hover:bg-[#f7fafc]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold leading-6 text-[var(--color-on-surface)]">
            {item.input.recipient.trim() || '상대 미입력'}
          </p>
          <p className="text-xs leading-5 text-[var(--color-on-surface-variant)]">
            {formatHistoryDate(item.createdAt)}
          </p>
        </div>
        <span
          className={[
            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
            isEdited ? 'bg-[#e8f5f1] text-[#2d6a4f]' : 'bg-[#eef2f6] text-[#3c5f7c]',
          ].join(' ')}
        >
          {isEdited ? '작성 완료' : '초안'}
        </span>
      </div>
      <p className="line-clamp-2 whitespace-pre-line text-sm leading-6 text-[var(--color-on-surface-variant)]">
        {preview}
      </p>
    </Link>
  );
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
