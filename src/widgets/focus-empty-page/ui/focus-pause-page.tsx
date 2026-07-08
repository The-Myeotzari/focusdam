"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Frown,
  Home,
  House,
  Maximize2,
  Pause,
  Settings,
  Timer
} from "lucide-react";

const pauseReasons = [
  {
    title: "너무 커 보여요",
    description: "3분 행동으로 축소",
    icon: Maximize2,
    iconClassName: "bg-[#cce5ff] text-[#3c5f7c]"
  },
  {
    title: "불안하거나 짜증나요",
    description: "감정 리셋 먼저",
    icon: Frown,
    iconClassName: "bg-[#ffdad8] text-[#ba1a1a]"
  },
  {
    title: "방해가 생겼어요",
    description: "나중에 이어하기",
    icon: House,
    iconClassName: "bg-[#ffddb6] text-[#8a6427]"
  }
] as const;

type PauseReasonTitle = (typeof pauseReasons)[number]["title"];

export function FocusPausePage() {
  const [selectedReason, setSelectedReason] = useState<PauseReasonTitle>(pauseReasons[0].title);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-y-auto bg-[#faf9fc] pb-8 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute left-1/2 top-[150px] h-[270px] w-[270px] -translate-x-1/2 rounded-full bg-[#ffddb6]/35 blur-[60px]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-[3] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/focus/current?duration=10"
          aria-label="타이머로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="relative z-[1] flex flex-1 flex-col px-5 pt-[170px]">
        <section className="flex flex-col items-center text-center">
          <span className="mb-[210px] flex size-[68px] items-center justify-center rounded-full border-[5px] border-[#8a6427] text-[#8a6427]">
            <Pause size={34} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>

          <h2 className="m-0 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            잠깐 멈췄나요?
          </h2>
          <p className="m-0 mt-6 w-[298px] text-[18px] font-medium leading-7 text-[#72777e]">
            왜 멈췄나요? 이유를 고르면 더 작은 행동으로 다시 줄여드립니다.
          </p>
        </section>

        <section className="mt-20 flex flex-col gap-6" aria-label="멈춘 이유 선택">
          {pauseReasons.map((reason) => {
            const Icon = reason.icon;
            const selected = selectedReason === reason.title;

            return (
              <button
                key={reason.title}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedReason(reason.title)}
                className={[
                  "flex min-h-[132px] w-full items-center gap-6 rounded-[32px] bg-white px-6 py-5 text-left shadow-[0_10px_30px_rgba(107,142,173,0.04)]",
                  selected ? "border-2 border-[#3c5f7c]" : "border border-[#c2c7ce]"
                ].join(" ")}
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${reason.iconClassName}`}>
                  <Icon size={23} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[18px] font-medium leading-7 text-[#1a1c1e]">{reason.title}</span>
                  <span className="mt-1 text-[16px] font-medium leading-6 text-[#5f656c]">
                    {reason.description}
                  </span>
                </span>
              </button>
            );
          })}
        </section>

        <section className="mt-16 flex flex-col gap-4">
          <Link
            href="/focus/current?duration=3"
            className="flex h-[66px] w-full items-center justify-center rounded-[32px] bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_12px_24px_rgba(60,95,124,0.14)]"
          >
            3분 행동으로 재시작
          </Link>
          <Link
            href="/focus/emotion-reset"
            className="flex h-[66px] w-full items-center justify-center rounded-[32px] bg-[#dde3eb] text-[18px] font-medium leading-7 text-[#5f656c]"
          >
            감정 리셋 먼저
          </Link>
        </section>
      </section>

      <PauseBottomNav />
    </main>
  );
}

function PauseBottomNav() {
  const items = [
    { label: "홈", icon: Home, href: "/", active: false },
    { label: "기록", icon: CalendarDays, href: "/starter/new", active: false },
    { label: "타이머", icon: Timer, href: "/focus/current?duration=10", active: true },
    { label: "설정", icon: Settings, href: "/settings", active: false }
  ] as const;

  return (
    <nav className="mt-10 flex h-20 w-full items-center justify-center gap-[27.8px] rounded-t-[32px] bg-white px-[29.91px] shadow-[0_-8px_30px_rgba(60,95,124,0.05)]">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={[
              "flex flex-col items-center justify-center px-4 py-1.5 text-[13px] font-medium leading-[18px] tracking-[0.52px]",
              item.active ? "h-[51px] w-[67px] rounded-full bg-[#557896] text-[#fcfcff]" : "h-12 text-[#5f656c]"
            ].join(" ")}
          >
            <Icon size={item.active ? 21 : 20} strokeWidth={2.3} aria-hidden="true" />
            <span className="mt-0.5 whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
