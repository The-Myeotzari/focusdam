"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCog,
  CalendarX2,
  ChartNoAxesCombined,
  Check,
  Info,
  MoreVertical,
  Sparkles
} from "lucide-react";

const SUGGESTION_APPLIED_STORAGE_KEY = "focusdam:emotion-insight-suggestion-applied";

const insightItems = [
  {
    label: "반복 감정",
    value: "불안",
    meta: "빈도 높음",
    icon: BrainCog,
    iconClassName: "bg-[#f8f0ff] text-[#8a63d2]"
  },
  {
    label: "주요 상황",
    value: "마감 직전",
    icon: CalendarX2,
    iconClassName: "bg-[#eef5ff] text-[#3c5f7c]"
  },
  {
    label: "추천",
    value: "오전 10시 10분 스타터",
    icon: Sparkles,
    iconClassName: "bg-[#e8f5e9] text-[#2e7d32]",
    emphasized: true
  }
] as const;

export function FocusEmotionInsightsPage() {
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    setIsApplied(window.localStorage.getItem(SUGGESTION_APPLIED_STORAGE_KEY) === "true");
  }, []);

  function applySuggestion() {
    window.localStorage.setItem(SUGGESTION_APPLIED_STORAGE_KEY, "true");
    setIsApplied(true);
  }

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="relative z-[2] flex h-16 w-full shrink-0 items-center justify-between bg-[#faf9fc] px-5 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/focus/emotion-reset/record"
            aria-label="이전 화면으로 돌아가기"
            className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
          >
            <ArrowLeft size={24} strokeWidth={2.4} />
          </Link>
          <h1 className="m-0 text-[16px] font-medium leading-6 text-[#3c5f7c]">마음 챙김</h1>
        </div>
        <button
          type="button"
          aria-label="더보기"
          className="flex size-8 items-center justify-center rounded-full text-[#72777e]"
        >
          <MoreVertical size={22} strokeWidth={2.8} />
        </button>
      </header>

      <section className="relative z-[1] flex flex-1 flex-col gap-10 overflow-y-auto px-5 pb-[216px] pt-8">
        <section className="relative isolate flex min-h-52 w-full flex-col gap-4 overflow-hidden rounded-[48px] bg-[rgba(60,95,124,0.05)] p-8">
          <h2 className="relative z-[1] m-0 max-w-[286px] text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            자주 반복되는
            <br />
            감정 패턴이에요
          </h2>
          <p className="relative z-[1] m-0 max-w-[243px] text-[16px] font-medium leading-[26px] text-[#42474d]">
            비슷한 상황에서 감정이 커지는 시간과 과업을 확인합니다.
          </p>
          <span
            className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[rgba(60,95,124,0.1)] blur-[32px]"
            aria-hidden="true"
          />
        </section>

        <section className="flex w-full flex-col gap-6" aria-label="감정 패턴 인사이트">
          <article className="flex min-h-[392px] w-full flex-col gap-8 rounded-[32px] border border-[rgba(194,199,206,0.3)] bg-white p-6 shadow-[0_10px_40px_-10px_rgba(60,95,124,0.08)]">
            <div className="flex">
              <span className="inline-flex h-[26px] items-center gap-2 rounded-full bg-[rgba(60,95,124,0.1)] px-3 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
                <ChartNoAxesCombined size={17} strokeWidth={2.4} aria-hidden="true" />
                인사이트 요약
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {insightItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={[
                      "flex min-h-[78px] w-full items-center justify-between rounded-[32px] bg-[#faf9fc] p-4",
                      "emphasized" in item && item.emphasized ? "border border-[rgba(60,95,124,0.2)]" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className={["flex size-10 shrink-0 items-center justify-center rounded-full", item.iconClassName].join(" ")}>
                        <Icon size={21} strokeWidth={2.4} aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#72777e]">
                          {item.label}
                        </span>
                        <p className="m-0 truncate text-[18px] font-medium leading-7 text-[#1a1c1e]">{item.value}</p>
                      </div>
                    </div>
                    {"meta" in item ? (
                      <span className="shrink-0 text-[14px] font-medium leading-5 text-[#8a63d2]">{item.meta}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>

          <aside className="flex min-h-[81px] w-full items-start gap-3 rounded-[32px] bg-[rgba(221,227,235,0.3)] p-4">
            <Info size={18} strokeWidth={2.3} className="mt-0.5 shrink-0 text-[#5f656c]" aria-hidden="true" />
            <p className="m-0 text-[13px] font-medium leading-4 tracking-[0.52px] text-[#5f656c]">
              감정 리포트와 개인화 추천으로 연결된 데이터 기반 분석 결과입니다. 다음 주 일정을 반영하여 마음의 부담을 덜어보세요.
            </p>
          </aside>
        </section>
      </section>

      <footer className="absolute bottom-0 left-0 z-[3] flex h-[184px] w-full flex-col bg-[linear-gradient(0deg,#faf9fc_0%,#faf9fc_70%,rgba(250,249,252,0)_100%)] px-5 pb-5 pt-12">
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={applySuggestion}
            disabled={isApplied}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white shadow-[0_10px_40px_-10px_rgba(60,95,124,0.08)] disabled:bg-[#6f879a]"
          >
            {isApplied ? <Check size={18} strokeWidth={2.6} aria-hidden="true" /> : null}
            {isApplied ? "다음 주 제안 적용됨" : "다음 주 제안 적용"}
          </button>
          <Link
            href="/review"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-[16px] font-medium leading-6 text-[#3c5f7c]"
          >
            리포트에서 보기
            <ArrowRight size={17} strokeWidth={2.3} aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
