"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  List,
  ListTodo,
  Play,
  Timer
} from "lucide-react";

const RECENT_STARTER_ACTIONS_STORAGE_KEY = "focusdam:recent-starter-actions";

const actions = [
  {
    title: "멘토 코멘트 3줄 복사",
    icon: ListTodo
  },
  {
    title: "BM 문단 제목만 쓰기",
    icon: List
  },
  {
    title: "10분 타이머 켜기",
    icon: Timer
  }
] as const;

export function StarterRecentPage() {
  const [savedActions, setSavedActions] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>(actions[0].title);
  const recentActions = [
    ...savedActions.map((title) => ({
      title,
      icon: ListTodo
    })),
    ...actions.filter((action) => !savedActions.includes(action.title))
  ];

  useEffect(() => {
    try {
      const storedActions = window.localStorage.getItem(RECENT_STARTER_ACTIONS_STORAGE_KEY);
      const parsedActions = storedActions ? (JSON.parse(storedActions) as string[]) : [];

      if (parsedActions.length > 0) {
        setSavedActions(parsedActions);
        setSelectedAction(parsedActions[0]);
      }
    } catch {
      setSavedActions([]);
    }
  }, []);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[156px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/starter/new"
          aria-label="이전 화면으로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 ml-3 text-[16px] font-medium leading-6 text-[#3c5f7c]">마음 챙김</h1>
      </header>

      <section className="flex flex-1 flex-col px-5 pt-[72px]">
        <section className="flex flex-col items-center text-center">
          <span className="flex h-[37px] items-center rounded-full bg-[#dce2e8] px-5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#5f656c]">
            최근 할 일
          </span>
          <h2 className="m-0 mt-8 w-[233px] text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            지금 할 행동은
            <br />이 정도면 충분해요
          </h2>
          <p className="m-0 mt-6 w-[289px] text-[16px] font-medium leading-6 text-[#72777e]">
            완벽하지 않아도 괜찮아요. 지금 바로 시작할 수 있는 가장 쉬운 방법들을 준비했어요.
          </p>
        </section>

        <section className="mt-[72px] flex flex-col gap-6" aria-label="최근 할 일 추천">
          {recentActions.map((action) => {
            const Icon = action.icon;
            const isSelected = selectedAction === action.title;

            return (
              <button
                key={`${action.title}-${savedActions.includes(action.title) ? "saved" : "default"}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedAction(action.title)}
                className={[
                  "flex h-[142px] w-full flex-col items-start gap-1 rounded-[32px] bg-white p-6 text-left shadow-[0_10px_40px_rgba(107,142,173,0.06)]",
                  isSelected
                    ? "border-2 border-[#3c5f7c] shadow-[0_0_0_2px_rgba(60,95,124,0.12),0_10px_40px_rgba(107,142,173,0.06)]"
                    : "border border-[#c2c7ce]"
                ].join(" ")}
              >
                <span className="flex w-full items-center justify-between">
                  <span
                    className={[
                      "flex size-12 items-center justify-center rounded-2xl",
                      isSelected ? "bg-[#557896] text-[#fcfcff]" : "bg-[#e8e8ea] text-[#42474d]"
                    ].join(" ")}
                  >
                    <Icon size={24} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  {isSelected ? (
                    <CheckCircle2 size={22} strokeWidth={2.5} className="text-[#3c5f7c]" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="mt-3 text-[18px] font-medium leading-7 text-[#1a1c1e]">
                  {action.title}
                </span>
              </button>
            );
          })}
        </section>

        <p className="m-0 mt-10 flex min-h-[69px] w-full items-center justify-center rounded-[32px] bg-[#f4f3f6] px-8 text-center text-[15px] font-medium leading-6 tracking-[0.6px] text-[#3c5f7c]">
          &quot;큰 산을 옮기는 것은 작은 돌을 옮기는 것부터 시작됩니다.&quot;
        </p>
      </section>

      <div className="fixed bottom-[var(--bottom-nav-height)] left-1/2 z-[2] flex w-full max-w-[390px] -translate-x-1/2 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-[#faf9fc00] px-5 pb-6 pt-6">
        <Link
          href="/starter/time"
          className="flex h-16 w-full items-center justify-center gap-2 rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          이 행동으로 시작
          <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </Link>
      </div>

    </main>
  );
}
