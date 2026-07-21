"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ListTodo,
  RotateCcw,
  Shapes,
  Star
} from "lucide-react";

const MAX_TASK_LENGTH = 50;

export function StarterCreatePage() {
  const [target, setTarget] = useState("");
  const [microAction, setMicroAction] = useState("");
  const [verb, setVerb] = useState("");

  const taskText = useMemo(() => {
    return [target, microAction, verb].filter(Boolean).join(" ");
  }, [target, microAction, verb]);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[136px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/focus"
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
          <h2 className="m-0 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            무엇을 시작해야 하나요?
          </h2>
          <p className="m-0 w-[270px] text-[18px] font-medium leading-7 text-[#595f66]">
            거창한 계획이 아니어도 괜찮아요.
            <br />
            지금 머릿속에 맴도는 일을 적어보세요.
          </p>
        </section>

        <section className="mt-12 flex flex-col gap-4" aria-label="새 최소 행동 입력">
          <div className="rounded-[28px] bg-[#3c5f7c0a] px-5 py-4">
            <p className="m-0 text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
              대상 + 최소 행동 + 하기
            </p>
            <p className="m-0 mt-1 text-[13px] font-medium leading-[18px] text-[#42474d]">
              예: 책상 위 물건 1개 정리하기
            </p>
          </div>

          <div className="relative isolate flex min-h-[328px] w-full flex-col rounded-[32px] border border-[#c2c7ce4d] bg-white p-8 shadow-[0_20px_40px_rgba(107,142,173,0.06)]">
            <span
              className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-[#3c5f7c] opacity-[0.03] blur-[32px]"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[#edbe85] opacity-10 blur-[32px]"
              aria-hidden="true"
            />

            <div className="relative z-[1] flex items-center gap-3">
              <ListTodo size={18} strokeWidth={3} className="text-[#3c5f7c]" aria-hidden="true" />
              <p className="m-0 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold uppercase leading-[18px] tracking-[0.65px] text-[#3c5f7c]/70">
                New Reflection Task
              </p>
            </div>

            <div className="relative z-[1] mt-7 rounded-[24px] bg-[#faf9fc] px-4 py-4">
              <p className="m-0 flex flex-wrap items-center gap-x-1 gap-y-2 text-[20px] font-medium leading-[34px]">
                <PreviewPart value={target} placeholder="대상" />
                <PreviewPart value={microAction} placeholder="최소 행동" />
                <PreviewPart value={verb} placeholder="하기" />
              </p>
            </div>

            <div className="relative z-[1] mt-5 grid gap-3">
              <StarterInput
                label="대상"
                value={target}
                onChange={setTarget}
                placeholder="예: 책상 위 물건"
              />
              <StarterInput
                label="최소 행동"
                value={microAction}
                onChange={setMicroAction}
                placeholder="예: 1개 정리"
              />
              <StarterInput
                label="하기"
                value={verb}
                onChange={setVerb}
                placeholder="예: 하기"
              />
            </div>

            <div className="relative z-[1] mt-auto flex h-[35px] items-end border-t border-[#c2c7ce1a] pt-4">
              <span className="font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#72777e]">
                {taskText.length}/{MAX_TASK_LENGTH}
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

          <Link
            href="/starter/recent"
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
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/starter/favorites"
              className="flex h-[134px] flex-col items-start rounded-[32px] border-0 bg-[#f4f3f6] px-5 py-5 text-left"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-white text-[#785526]">
                <Star size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">즐겨찾기</span>
              <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#595f66]/70">
                자주 반복하는 루틴
              </span>
            </Link>

            <Link
              href="/starter/templates"
              className="flex h-[134px] flex-col items-start rounded-[32px] border-0 bg-[#f4f3f6] px-5 py-5 text-left"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-white text-[#557896]">
                <Shapes size={22} strokeWidth={2.6} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">템플릿</span>
              <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#595f66]/70">
                전문적인 워크플로우
              </span>
            </Link>
          </div>
        </section>
      </section>

      <div className="fixed bottom-0 left-1/2 z-[2] flex w-full max-w-[390px] -translate-x-1/2 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-[#faf9fc00] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6">
        <Link
          href="/starter/time"
          className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          최소 행동 만들기
          <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
        </Link>
      </div>

    </main>
  );
}

function PreviewPart({ value, placeholder }: { value: string; placeholder: string }) {
  return (
    <span className={value ? "text-[#1a1c1e]" : "text-[#c2c7ce]/60"}>
      {value || placeholder}
    </span>
  );
}

function StarterInput({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="grid gap-1">
      <span className={value ? "text-[12px] font-semibold text-[#3c5f7c]" : "text-[12px] font-semibold text-[#72777e]/60"}>
        {label}
      </span>
      <input
        value={value}
        maxLength={MAX_TASK_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-2xl border border-[#c2c7ce33] bg-white px-4 text-[15px] font-medium text-[#1a1c1e] outline-none placeholder:text-[#c2c7ce]/60 focus:border-[#3c5f7c80]"
      />
    </label>
  );
}
