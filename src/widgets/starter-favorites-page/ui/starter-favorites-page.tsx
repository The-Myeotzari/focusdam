"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Heart,
  PenLine,
  Play,
  Star,
  Wind
} from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const favoriteActions = [
  {
    title: "매일 제목만 쓰기",
    description: "부담 없는 시작을 위해",
    icon: PenLine
  },
  {
    title: "1분 호흡하며 정돈하기",
    description: "감각을 깨우는 시간",
    icon: Wind
  },
  {
    title: "감정 한 줄 남기기",
    description: "지금 마음을 가볍게 적기",
    icon: Heart
  }
] as const;

export function StarterFavoritesPage() {
  const [selectedAction, setSelectedAction] = useState<string>(favoriteActions[0].title);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[156px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="마음 챙김" backHref="/starter/new" className="z-[2]" />

      <section className="flex flex-1 flex-col px-5 pt-[72px]">
        <section className="flex flex-col items-center text-center">
          <span className="flex h-[37px] items-center gap-2 rounded-full bg-[#fff2df] px-5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#785526]">
            <Star size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            즐겨찾기
          </span>
          <h2 className="m-0 mt-8 w-[248px] text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            자주 하던 루틴을
            <br />
            바로 시작해요
          </h2>
          <p className="m-0 mt-6 w-[289px] text-[16px] font-medium leading-6 text-[#72777e]">
            반복하던 작은 행동을 다시 꺼내왔어요. 오늘은 고르기만 해도 충분합니다.
          </p>
        </section>

        <section className="mt-[72px] flex flex-col gap-6" aria-label="즐겨찾기 루틴 추천">
          {favoriteActions.map((action) => {
            const Icon = action.icon;
            const isSelected = selectedAction === action.title;

            return (
              <button
                key={action.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedAction(action.title)}
                className={[
                  "flex min-h-[156px] w-full flex-col items-start rounded-[32px] bg-white px-6 pb-7 pt-6 text-left shadow-[0_10px_40px_rgba(107,142,173,0.06)]",
                  isSelected
                    ? "border-2 border-[#785526] shadow-[0_0_0_2px_rgba(120,85,38,0.12),0_10px_40px_rgba(107,142,173,0.06)]"
                    : "border border-[#c2c7ce]"
                ].join(" ")}
              >
                <span className="flex w-full items-center justify-between">
                  <span
                    className={[
                      "flex size-12 items-center justify-center rounded-2xl",
                      isSelected ? "bg-[#785526] text-[#fcfcff]" : "bg-[#f4f3f6] text-[#5f656c]"
                    ].join(" ")}
                  >
                    <Icon size={24} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  {isSelected ? (
                    <CheckCircle2 size={22} strokeWidth={2.5} className="text-[#785526]" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="mt-5 text-[18px] font-medium leading-7 text-[#1a1c1e]">
                  {action.title}
                </span>
                <span className="mt-1 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#72777e]">
                  {action.description}
                </span>
              </button>
            );
          })}
        </section>

        <p className="m-0 mt-10 flex min-h-[69px] w-full items-center justify-center rounded-[32px] bg-[#fff2df]/60 px-8 text-center text-[15px] font-medium leading-6 tracking-[0.6px] text-[#785526]">
          익숙한 행동은 다시 시작하는 힘이 됩니다.
        </p>
      </section>

      <div className="fixed bottom-[var(--bottom-nav-height)] left-1/2 z-[2] flex w-full max-w-[390px] -translate-x-1/2 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-[#faf9fc00] px-5 pb-6 pt-6">
        <Link
          href="/starter/time"
          className="flex h-16 w-full items-center justify-center gap-2 rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          이 루틴으로 시작
          <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </Link>
      </div>

    </main>
  );
}
