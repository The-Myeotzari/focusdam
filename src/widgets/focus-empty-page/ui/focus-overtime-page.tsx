import Link from "next/link";
import {
  CheckCircle2,
  Grid2X2,
  Hourglass,
  Lightbulb,
  PlusCircle
} from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

export function FocusOvertimePage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-y-auto bg-[#faf9fc] pb-28 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute -left-20 top-[430px] h-72 w-44 rounded-full bg-[#cce5ff]/30 blur-[50px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-16 top-[455px] h-72 w-44 rounded-full bg-[#ffddb6]/30 blur-[50px]"
        aria-hidden="true"
      />

      <SiteTopBar title="마음 챙김" backHref="/focus/current?duration=10" className="sticky top-0 z-[3]" />

      <section className="relative z-[1] flex flex-col items-center px-5 pb-8 pt-10">
        <section
          className="flex h-[320px] w-[320px] flex-col items-center justify-center rounded-full bg-[#fff7ef]"
          aria-label="예상 시간 초과"
        >
          <span className="flex size-20 items-center justify-center rounded-full bg-white text-[#8a6427] shadow-[0_10px_30px_rgba(138,100,39,0.04)]">
            <Hourglass size={42} strokeWidth={2.6} aria-hidden="true" />
          </span>
          <p className="m-0 mt-8 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[32px] font-bold leading-[38px] tracking-[-0.8px] text-[#8a6427]">
            + 05:24
          </p>
          <p className="m-0 mt-1 text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#42474d]">
            예상 시간 초과
          </p>
        </section>

        <section className="mt-12 flex flex-col items-center text-center">
          <h2 className="m-0 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            예상보다 길어지고 있어요
          </h2>
          <p className="m-0 mt-5 w-[287px] text-[18px] font-medium leading-7 text-[#42474d]">
            계속 밀어붙이기보다 작게 나누거나 잠시 멈추는 것도 좋은 방법입니다.
          </p>
        </section>

        <section className="mt-12 flex w-full flex-col gap-4">
          <Link
            href="/focus/current?duration=15"
            className="flex h-[66px] w-full items-center justify-center gap-3 rounded-[32px] bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_12px_24px_rgba(60,95,124,0.12)]"
          >
            <PlusCircle size={20} strokeWidth={2.5} aria-hidden="true" />
            5분 연장
          </Link>

          <Link
            href="/starter/new"
            className="flex h-[94px] w-full flex-col items-center justify-center rounded-[28px] border border-[#f3dcc2] bg-[#fff3e8] text-[#8a6427]"
          >
            <Grid2X2 size={22} strokeWidth={2.4} aria-hidden="true" />
            <span className="mt-2 text-[18px] font-medium leading-7">쪼개기 다시</span>
            <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#5f656c]">
              행동을 더 작게 나누기
            </span>
          </Link>

          <Link
            href="/focus/split-task"
            className="flex h-[94px] w-full flex-col items-center justify-center rounded-[28px] bg-[#eeedf0] text-[#5f656c]"
          >
            <CheckCircle2 size={22} strokeWidth={2.4} aria-hidden="true" />
            <span className="mt-2 text-[18px] font-medium leading-7">오늘은 완료</span>
            <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px]">
              현재까지 기록하고 마침
            </span>
          </Link>
        </section>

        <aside className="mt-12 flex w-full gap-4 rounded-[28px] bg-white px-6 py-5 shadow-[0_18px_36px_rgba(60,95,124,0.05)]">
          <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffddb6] text-[#8a6427]">
            <Lightbulb size={17} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <p className="m-0 text-[18px] font-medium leading-7 text-[#42474d]">
            &quot;집중의 흐름은 파도와 같습니다. 무리하기보다 자신의 리듬에 맞춰 나아가는 것이 지속 가능한 성장의 비결입니다.&quot;
          </p>
        </aside>
      </section>

    </main>
  );
}
