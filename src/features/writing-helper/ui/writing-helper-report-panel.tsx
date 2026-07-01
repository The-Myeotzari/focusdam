'use client';

import { ArrowLeft, CheckCircle2, Clipboard, PenLine } from 'lucide-react';

import type { WritingHelperResult } from '../model/writing-helper.types';

type WritingHelperReportPanelProps = {
  result: WritingHelperResult;
  draft: string;
  copyMessage: string;
  onBack: () => void;
  onUseDraftExample: () => void;
  onDraftChange: (draft: string) => void;
  onCopyDraft: () => void;
};

export function WritingHelperReportPanel({
  result,
  draft,
  copyMessage,
  onBack,
  onUseDraftExample,
  onDraftChange,
  onCopyDraft,
}: WritingHelperReportPanelProps) {
  return (
    <main className="flex flex-col gap-6 px-5 py-4">
      <section className="flex flex-col gap-7">
        <button
          type="button"
          className="flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          onClick={onBack}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          다시 입력하기
        </button>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase leading-4 tracking-[0.02em] text-[var(--color-primary)]">
                REPORT
              </p>
              <h1 className="mt-1 text-[26px] font-normal leading-[1.35] tracking-[-0.03em] text-[var(--color-on-surface)]">
                {result.headline}
              </h1>
            </div>
          </div>

          <div className="mt-5 grid gap-2 rounded-[20px] bg-[var(--color-surface-container-low)] p-4">
            {result.summary.map((item) => {
              return (
                <p
                  key={item}
                  className="text-sm leading-6 text-[var(--color-on-surface-variant)]"
                >
                  {item}
                </p>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 rounded-[20px] bg-[#f0f7f4] p-4">
            <div>
              <h2 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
                조합 초안
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                입력한 핵심을 이어 붙이면 이런 흐름으로 시작할 수 있습니다.
              </p>
            </div>
            <p className="whitespace-pre-line text-sm leading-7 text-[var(--color-on-surface)]">
              {result.draftExample}
            </p>
            <button
              type="button"
              className="site-button site-button--secondary !min-h-[46px] !w-full !gap-2 !rounded-[16px] !text-sm"
              onClick={onUseDraftExample}
            >
              <PenLine size={16} aria-hidden="true" />
              이 초안으로 작성 시작
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            {result.sections.map((section) => {
              return (
                <div key={section.title}>
                  <h2 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                    {section.guide}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {section.starters.map((starter) => {
                      return (
                        <div
                          key={starter}
                          className="grid grid-cols-[20px_1fr] gap-3 rounded-[16px] bg-[#f4f7fa] px-4 py-3"
                        >
                          <PenLine
                            size={16}
                            aria-hidden="true"
                            className="mt-1 text-[var(--color-primary)]"
                          />
                          <p className="text-sm leading-6 text-[var(--color-on-surface)]">
                            {starter}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="my-6 h-px bg-[#c2c7ce47]" />

          <div className="grid gap-3">
            <div>
              <h2 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
                직접 작성하기
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                위의 시작 문장을 참고해서 보내고 싶은 문장을 직접 적어보세요.
              </p>
            </div>
            <textarea
              className="site-input min-h-[180px] resize-none !rounded-[20px] !bg-[#fcfcff] !px-5 !py-4"
              placeholder="여기에 직접 문장을 작성해보세요."
              value={draft}
              onChange={(event) => {
                onDraftChange(event.target.value);
              }}
            />
            <button
              type="button"
              className="site-button site-button--primary !min-h-[52px] !w-full !gap-2 !text-base"
              onClick={onCopyDraft}
            >
              <Clipboard size={18} aria-hidden="true" />
              작성한 문장 복사
            </button>
            {copyMessage ? (
              <p className="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                {copyMessage}
              </p>
            ) : null}
          </div>

          <div className="my-6 h-px bg-[#c2c7ce47]" />

          <div className="grid gap-3">
            <h2 className="text-base font-semibold leading-6 text-[var(--color-on-surface)]">
              보내기 전 확인
            </h2>
            {result.checklist.map((item) => {
              return (
                <div key={item} className="grid grid-cols-[20px_1fr] gap-3">
                  <CheckCircle2
                    size={17}
                    aria-hidden="true"
                    className="mt-1 text-[var(--color-primary)]"
                  />
                  <p className="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
