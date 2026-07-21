"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const ACTIVE_STARTER_ACTION_STORAGE_KEY = "focusdam:active-starter-action";

const completionOptions = ["가벼움", "보통", "힘듦"] as const;
const focusOptions = ["낮음", "보통", "높음"] as const;

export function FocusCompletePage() {
  const [completionMood, setCompletionMood] = useState<string>("가벼움");
  const [focusLevel, setFocusLevel] = useState<string>("보통");

  useEffect(() => {
    window.localStorage.removeItem(ACTIVE_STARTER_ACTION_STORAGE_KEY);
  }, []);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-y-auto bg-[#faf9fc] pb-24 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="마음 챙김" backHref="/focus/current?duration=10" className="sticky top-0 z-[2]" />

      <section className="relative flex flex-1 flex-col px-5 pb-8 pt-12">
        <span
          className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#e6f4f1] opacity-40 blur-[40px]"
          aria-hidden="true"
        />

        <section className="relative z-[1] flex flex-col items-center rounded-[32px] bg-white px-8 py-8 shadow-[0_20px_40px_rgba(107,142,173,0.06)]">
          <div className="flex h-[54px] w-[72px] items-center justify-center rounded-full bg-[#e6f4f1] text-[#3d7068]">
            <span className="flex h-8 w-10 items-center justify-center rounded-full bg-[#3d7068] text-white">
              <Check size={24} strokeWidth={3} aria-hidden="true" />
            </span>
          </div>

          <h2 className="m-0 mt-6 w-[239px] text-center text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            12분 만에 완료했어요
          </h2>

          <p className="m-0 mt-5 w-[210px] text-center text-[18px] font-medium leading-7 text-[#595f66]">
            예상보다 13분 빨랐습니다. 다음 계획에 반영할게요.
          </p>

          <div className="mt-8 flex h-[88px] w-full items-center justify-center gap-4 rounded-[48px] bg-[#eeedf0] px-6 py-4">
            <TimeStat label="예상" value="25분" muted />
            <span className="h-8 w-px bg-[#c2c7ce]" aria-hidden="true" />
            <TimeStat label="실제" value="12분" />
          </div>

          <FeedbackGroup
            title="오늘의 완료감은 어떠셨나요?"
            options={completionOptions}
            value={completionMood}
            onChange={setCompletionMood}
          />

          <FeedbackGroup
            title="오늘의 집중도는 어떠셨나요?"
            options={focusOptions}
            value={focusLevel}
            onChange={setFocusLevel}
          />
        </section>

        <section className="relative z-[1] mt-12 flex flex-col gap-4">
          <Link
            href="/focus/actions"
            className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            다음 행동 보기
          </Link>
          <Link
            href="/focus"
            className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#dde3eb] text-[18px] font-medium leading-7 text-[#5f656c]"
          >
            오늘은 여기까지
          </Link>
        </section>
      </section>

    </main>
  );
}

function TimeStat({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex w-[58px] flex-col items-center gap-1">
      <span className="text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#72777e]">
        {label}
      </span>
      <span
        className={[
          "font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[28px] leading-[34px]",
          muted ? "font-medium text-[#595f66]" : "font-bold text-[#3c5f7c]"
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function FeedbackGroup({
  title,
  options,
  value,
  onChange
}: {
  title: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="mt-8 flex w-full flex-col gap-4">
      <h3 className="m-0 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#1a1c1e]">
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={[
                "flex h-[50px] items-center justify-center rounded-full border px-2 text-[16px] font-medium leading-6",
                selected
                  ? "border-[#3c5f7c] bg-[#3c5f7c] text-white"
                  : "border-[#c2c7ce] bg-white text-[#1a1c1e]"
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
