"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Home,
  ListTodo,
  RotateCcw,
  Settings,
  Shapes,
  Star,
  Timer
} from "lucide-react";

const MAX_TASK_LENGTH = 50;

export function StarterCreatePage() {
  const [task, setTask] = useState("");

  return (
    <main
      aria-labelledby="starter-create-title"
      className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[136px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <header className="z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/"
          aria-label="이전 화면으로 돌아가기"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="relative z-0 flex w-full flex-1 flex-col px-5 pt-12">
        <section className="flex flex-col items-center gap-4 text-center">
          <h2
            id="starter-create-title"
            className="m-0 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]"
          >
            무엇을 시작해야 하나요?
          </h2>
          <p className="m-0 w-[270px] text-[18px] font-medium leading-7 text-[#595f66]">
            거창한 계획이 아니어도 괜찮아요.
            <br />
            지금 머릿속에 맴도는 일을 적어보세요.
          </p>
        </section>

        <section className="relative mt-12" aria-label="새 최소 행동 입력">
          <span
            className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-[#3c5f7c] opacity-[0.03] blur-[32px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[#edbe85] opacity-10 blur-[32px]"
            aria-hidden="true"
          />

          <div className="relative z-[1] flex h-[287px] w-full flex-col rounded-[32px] border border-[#c2c7ce4d] bg-white p-8 shadow-[0_20px_40px_rgba(107,142,173,0.06)]">
            <div className="flex items-center gap-3">
              <ListTodo size={18} strokeWidth={3} className="text-[#3c5f7c]" aria-hidden="true" />
              <p className="m-0 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold uppercase leading-[18px] tracking-[0.65px] text-[#3c5f7c]/70">
                New Reflection Task
              </p>
            </div>

            <textarea
              value={task}
              maxLength={MAX_TASK_LENGTH}
              onChange={(event) => setTask(event.target.value)}
              placeholder="예: 사업계획서 목차 항목 이름 수정"
              className="mt-6 h-[120px] w-full resize-none bg-transparent p-0 text-[20px] font-medium leading-[34px] text-[#1a1c1e] outline-none placeholder:text-[#c2c7ce]/50"
            />

            <div className="mt-auto flex h-[35px] items-end border-t border-[#c2c7ce1a] pt-4">
              <span className="font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#72777e]">
                {task.length}/{MAX_TASK_LENGTH}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-12 flex flex-col gap-6" aria-label="불러오기">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#c2c7ce]/30" />
            <span className="px-2 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#72777e]">
              불러오기
            </span>
            <span className="h-px flex-1 bg-[#c2c7ce]/30" />
          </div>

          <button
            type="button"
            className="flex h-[82px] w-full items-center justify-between rounded-[32px] border-0 bg-[#f4f3f6] p-5 text-left"
          >
            <span className="flex items-center gap-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#3c5f7c]">
                <RotateCcw size={22} strokeWidth={2.6} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">최근 할 일</span>
                <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#595f66]/70">
                  어제 하던 작업을 이어하세요
                </span>
              </span>
            </span>
            <ChevronRight size={24} strokeWidth={2.6} className="text-[#72777e]" aria-hidden="true" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex h-[134px] flex-col items-start rounded-[32px] border-0 bg-[#f4f3f6] px-5 py-5 text-left"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-white text-[#785526]">
                <Star size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">즐겨찾기</span>
              <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#595f66]/70">
                자주 반복하는 루틴
              </span>
            </button>

            <button
              type="button"
              className="flex h-[134px] flex-col items-start rounded-[32px] border-0 bg-[#f4f3f6] px-5 py-5 text-left"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-white text-[#557896]">
                <Shapes size={22} strokeWidth={2.6} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">템플릿</span>
              <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#595f66]/70">
                전문적인 워크플로우
              </span>
            </button>
          </div>
        </section>
      </section>

      <div className="fixed bottom-[51px] left-1/2 z-[2] flex w-full max-w-[390px] -translate-x-1/2 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-[#faf9fc00] px-5 pb-6 pt-6">
        <button
          type="button"
          className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          최소 행동 만들기
          <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>

      <BottomNav />
    </main>
  );
}

function BottomNav() {
  const items = [
    { label: "홈", icon: Home, href: "/", active: false },
    { label: "기록", icon: CalendarDays, href: "/starter/new", active: true },
    { label: "타이머", icon: Timer, href: "/timer", active: false },
    { label: "설정", icon: Settings, href: "/settings", active: false }
  ] as const;

  return (
    <nav
      aria-label="하단 내비게이션"
      className="fixed bottom-0 left-1/2 z-[3] flex h-[51px] w-full max-w-[390px] -translate-x-1/2 items-center justify-center gap-[27.8px] rounded-t-[32px] bg-white px-[29.91px] shadow-[0_-8px_30px_rgba(60,95,124,0.05)]"
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={[
              "flex h-[50px] flex-col items-center justify-center px-4 py-1.5 text-[13px] font-medium leading-[18px] tracking-[0.52px]",
              item.active ? "w-[55px] rounded-full bg-[#557896] text-[#fcfcff]" : "text-[#5f656c]"
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Icon size={item.active ? 20 : 19} strokeWidth={2.3} aria-hidden="true" />
            <span className="mt-0.5 whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
