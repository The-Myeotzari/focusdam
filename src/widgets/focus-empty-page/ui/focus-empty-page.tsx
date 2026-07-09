import Link from "next/link";
import {
  Banknote,
  ChevronRight,
  Heart,
  MessageSquare,
  PencilLine,
  Sparkles,
  Target,
  Wind,
  Zap
} from "lucide-react";
import { FocusBottomNav } from "./focus-bottom-nav";

const sampleRoutines = [
  {
    title: "매일 제목만 쓰기",
    description: "부담 없는 시작을 위해",
    icon: PencilLine,
    iconClassName: "bg-[#edbe8533] text-[#785526]"
  },
  {
    title: "1분 호흡하며 정돈하기",
    description: "감각을 깨우는 시간",
    icon: Wind,
    iconClassName: "bg-[#cce5ff4d] text-[#3c5f7c]"
  }
] as const;

const templateChips = [
  {
    label: "업무",
    icon: Zap,
    className: "border-[#eeeae7] bg-[#eeeae7] text-[#8a6221]"
  },
  {
    label: "소비",
    icon: Banknote,
    className: "border-[#e5f5e9] bg-[#e5f5e9] text-[#248337]"
  },
  {
    label: "감정",
    icon: Heart,
    className: "border-[#ffe5ef] bg-[#ffe5ef] text-[#e91668]"
  },
  {
    label: "대화",
    icon: MessageSquare,
    className: "border-[#e0f1ff] bg-[#e0f1ff] text-[#0a61b9]"
  }
] as const;

export function FocusEmptyPage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[114px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[1] flex h-14 w-full items-center bg-[#faf9fc] px-5 py-4">
        <h1 className="m-0 text-[16px] font-medium leading-6 text-[#3c5f7c]">집중이담</h1>
      </header>

      <section className="z-0 flex w-full flex-1 flex-col gap-12 px-5 pb-4 pt-8">
        <section className="relative isolate flex h-[364px] w-full flex-col overflow-hidden rounded-[32px] bg-white px-8 pb-8 pt-14 shadow-[0_10px_30px_-5px_rgba(107,142,173,0.08)]">
          <span
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#cce5ff] opacity-10 blur-[32px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#ffddb6] opacity-20 blur-[20px]"
            aria-hidden="true"
          />

          <div className="relative z-[2] flex w-full flex-col items-center">
            <div className="flex h-[104px] w-20 flex-col items-start pb-6">
              <span className="flex size-20 items-center justify-center rounded-full bg-[#5578961a] text-[#3c5f7c]">
                <Sparkles size={38} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>

            <h2 className="m-0 pb-3 text-center text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
              아직 기록이 없어요
            </h2>
            <p className="m-0 max-w-[280px] text-center text-[16px] font-medium leading-6 text-[#42474d]">
              작은 행동 하나를 완료하면
              <br />
              나만의 패턴이 쌓이기 시작합니다.
            </p>

            <Link
              href="/starter/new"
              className="mt-6 flex h-[50px] w-full items-center justify-center rounded-full bg-[#3c5f7c] font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-white shadow-[0_4px_6px_-1px_rgba(60,95,124,0.2),0_2px_4px_-2px_rgba(60,95,124,0.2)]"
            >
              스타터 만들기
            </Link>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4" aria-labelledby="sample-routines-title">
          <h2
            id="sample-routines-title"
            className="m-0 flex items-center gap-2 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[18px] font-normal leading-7 text-[#1a1c1e]"
          >
            <Sparkles size={22} fill="currentColor" strokeWidth={1.5} className="text-[#3c5f7c]" aria-hidden="true" />
            Sample Routines
          </h2>

          <div className="flex flex-col gap-3">
            {sampleRoutines.map((routine) => {
              const Icon = routine.icon;

              return (
                <Link
                  key={routine.title}
                  href="/focus/current"
                  className="flex h-[82px] items-center rounded-[32px] border border-[#c2c7ce4d] bg-white p-4 shadow-[0_10px_30px_-5px_rgba(107,142,173,0.08)]"
                >
                  <span className={`mr-4 flex size-12 shrink-0 items-center justify-center rounded-2xl ${routine.iconClassName}`}>
                    <Icon size={22} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium leading-6 text-[#1a1c1e]">{routine.title}</span>
                    <span className="block text-[12px] font-medium leading-[18px] text-[#42474d]/70">{routine.description}</span>
                  </span>
                  <ChevronRight size={22} strokeWidth={2.4} className="ml-2 shrink-0 text-[#c2c7ce]" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4" aria-labelledby="templates-title">
          <div className="flex w-full items-center justify-between gap-3">
            <h2
              id="templates-title"
              className="m-0 flex items-center gap-2 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[18px] font-normal leading-7 text-[#1a1c1e]"
            >
              <Target size={22} strokeWidth={2.4} className="text-[#3c5f7c]" aria-hidden="true" />
              Templates
            </h2>

            <Link
              href="/focus/templates"
              className="flex h-8 shrink-0 items-center justify-center rounded-full border border-[#dde3eb] bg-white px-3 text-[12px] font-medium leading-[18px] tracking-[0.24px] text-[#3c5f7c] shadow-[0_6px_18px_-8px_rgba(107,142,173,0.35)]"
            >
              설명 보기
            </Link>
          </div>

          <div className="-mr-5 flex h-[62px] gap-[19px] overflow-x-auto pb-4 pr-5">
            {templateChips.map((chip) => {
              const Icon = chip.icon;

              return (
                <Link
                  key={chip.label}
                  href="/starter/new"
                  className={`flex h-[46px] shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-[13px] font-medium leading-[18px] tracking-[0.52px] ${chip.className}`}
                >
                  <Icon size={18} strokeWidth={2.4} aria-hidden="true" />
                  {chip.label}
                </Link>
              );
            })}
          </div>
        </section>
      </section>

      <FocusBottomNav />
    </main>
  );
}
