"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCcw, Wind } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const DEFAULT_DURATION_MINUTES = 10;
const ACTIVE_STARTER_ACTION_STORAGE_KEY = "focusdam:active-starter-action";

export function FocusCurrentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duration = Number(searchParams.get("duration") ?? DEFAULT_DURATION_MINUTES);
  const initialRemainingSeconds = Math.max(duration * 60 - 79, 0);
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemainingSeconds);
  const remainingTime = formatRemainingTime(remainingSeconds);

  useEffect(() => {
    setRemainingSeconds(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  useEffect(() => {
    window.localStorage.setItem(
      ACTIVE_STARTER_ACTION_STORAGE_KEY,
      JSON.stringify({
        title: "보고서 목차만 정리하기",
        duration,
        startedAt: new Date().toISOString()
      })
    );
  }, [duration]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      router.push(`/focus/overtime?duration=${duration}&overrunSeconds=324`);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [duration, remainingSeconds, router]);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#cce5ff] opacity-30 blur-[60px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-24 top-[348px] h-64 w-64 rounded-full bg-[#ffddb6] opacity-30 blur-[50px]"
        aria-hidden="true"
      />

      <SiteTopBar title="타이머 실행" backHref="/starter/time" className="relative z-[1]" />

      <section className="relative z-[1] flex flex-1 flex-col items-center px-5 pb-12 pt-[72px]">
        <section className="relative isolate flex h-[288px] w-[288px] items-center justify-center p-0" aria-label="남은 시간">
          <svg className="absolute inset-0 h-[288px] w-[288px] -rotate-90" viewBox="0 0 288 288" aria-hidden="true">
            <circle cx="144" cy="144" r="138.24" fill="none" stroke="#e8e8ea" strokeWidth="4" />
            <circle
              cx="144"
              cy="144"
              r="138.24"
              fill="none"
              stroke="#3c5f7c"
              strokeLinecap="round"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 138.24}`}
              strokeDashoffset={`${2 * Math.PI * 138.24 * 0.16}`}
            />
          </svg>
          <div className="relative z-[2] flex h-24 w-[142.73px] flex-col items-center justify-center p-0">
            <p className="m-0 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[64px] font-normal leading-[64px] tracking-[-3.2px] text-[#1a1c1e]">
              {remainingTime}
            </p>
            <p className="m-0 mt-2 text-[16px] font-medium leading-6 tracking-[1.6px] text-[#72777e]">
              남은 시간
            </p>
          </div>
        </section>

        <h2 className="m-0 mt-12 text-center text-[16px] font-medium leading-6 text-[#3c5f7c]">
          보고서 목차만 정리하기
        </h2>

        <section className="mt-20 flex w-full max-w-[320px] flex-col items-center gap-3" aria-label="빠른 도움">
          <p className="m-0 text-[16px] font-medium uppercase leading-6 tracking-[0.8px] text-[#72777e]">
            빠른 도움
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/focus/emotion-reset"
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8edf3] px-4 text-[16px] font-medium leading-6 text-[#5f656c]"
            >
              <RefreshCcw size={18} strokeWidth={2.4} aria-hidden="true" />
              감정 리셋
            </Link>
            <Link
              href="/focus/pause"
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8edf3] px-4 text-[16px] font-medium leading-6 text-[#5f656c]"
            >
              <Wind size={18} strokeWidth={2.4} aria-hidden="true" />
              잠깐 멈춤
            </Link>
          </div>
        </section>

        <section className="mt-auto flex w-full flex-col gap-4 pt-12">
          <Link
            href="/focus/complete"
            className="flex h-16 w-full items-center justify-center rounded-[32px] bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white shadow-[0_10px_15px_-3px_rgba(60,95,124,0.1),0_4px_6px_-4px_rgba(60,95,124,0.1)]"
          >
            완료
          </Link>
          <Link
            href="/focus/pause"
            className="flex h-14 w-full items-center justify-center rounded-[32px] bg-[#e8e8ea] text-[16px] font-medium leading-6 text-[#42474d]"
          >
            잠깐 멈춤
          </Link>
        </section>
      </section>
    </main>
  );
}

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${`${minutes}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;
}
