"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock3, FileText, Timer } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

export function FocusNextActionPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "보고서 목차만 정리하기";
  const subtitle = searchParams.get("subtitle") ?? "초안만 만들기";
  const duration = Number(searchParams.get("duration") ?? 25);
  const recommended = Number(searchParams.get("recommended") ?? 10);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <section className="mx-auto flex min-h-[100svh] w-full max-w-[360px] flex-col overflow-hidden rounded-[48px] border-8 border-[#eeedf0] bg-[#faf9fc] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <SiteTopBar title="마음 챙김" backHref="/focus/actions" />

        <section className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-8 pt-8">
          <section className="relative isolate flex h-52 w-full flex-col items-start overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(60,95,124,0.06)]">
            <span
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(60,95,124,0.05)_0%,rgba(60,95,124,0)_100%)]"
              aria-hidden="true"
            />
            <div className="relative z-[1] flex w-full flex-col gap-2">
              <span className="flex h-[26px] w-fit items-center rounded-full bg-[#3c5f7c1a] px-3 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
                현재 작업
              </span>
              <h2 className="m-0 pt-2 text-[28px] font-medium leading-[35px] text-[#1a1c1e]">
                {title}
              </h2>
              <p className="m-0 flex items-center gap-2 text-[16px] font-medium leading-6 text-[#42474d]">
                <FileText size={15} strokeWidth={2.4} aria-hidden="true" />
                {subtitle}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <article className="flex h-[88px] items-center gap-4 rounded-[32px] bg-[#f4f3f6] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3c5f7c] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <Clock3 size={24} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-medium leading-6 text-[#72777e]">예상시간</span>
                <span className="text-[20px] font-medium leading-7 text-[#1a1c1e]">{duration}분</span>
              </span>
            </article>

            <article className="flex h-[92px] items-center gap-4 rounded-[32px] border-2 border-[#dde1e6] bg-[#f4f3f6] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#3c5f7c] text-white">
                <Timer size={24} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-medium leading-6 text-[#3c5f7c]">추천 실행</span>
                <span className="text-[20px] font-medium leading-7 text-[#3c5f7c]">{recommended}분</span>
              </span>
            </article>
          </section>

          <section className="mt-auto flex flex-col items-center gap-6">
            <span className="h-1 w-16 rounded-full bg-[#e8e8ea]" aria-hidden="true" />
            <p className="m-0 w-[292px] text-center text-[18px] font-medium leading-7 text-[#8f9196]">
              &quot;완벽함보다 완성이 중요합니다. 가벼운 마음으로 시작해보세요.&quot;
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <Link
              href={`/focus/current?duration=${recommended}`}
              className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_14px_26px_rgba(60,95,124,0.15)]"
            >
              시작
            </Link>
            <Link
              href="/starter/recent"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#e8edf3] text-[16px] font-medium leading-6 text-[#5f656c]"
            >
              행동 바꾸기
            </Link>
          </section>
        </section>
      </section>
    </main>
  );
}
