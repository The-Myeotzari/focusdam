"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Info, Leaf, Target, Timer } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const recoveryItems = [
  {
    label: "예상시간",
    value: "3분",
    icon: Timer
  },
  {
    label: "완료 기준",
    value: "초안 품질 상관없음",
    icon: Target
  }
] as const;

export function FocusEmotionRestartPage() {
  const router = useRouter();
  const [nextAction, setNextAction] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAction = nextAction.trim();
    if (!trimmedAction) return;

    window.localStorage.setItem("focusdam:emotion-reset-next-action", trimmedAction);
    router.push("/focus/emotion-reset/record");
  }

  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="마음 챙김" backHref="/focus/emotion-reset/reframe" className="z-[2]" />

      <section className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-[172px] pt-8">
        <section className="flex h-[239px] w-full flex-col items-start gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-[#e9f5ef] text-[#2d6a4f]">
            <Leaf size={28} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <h2 className="m-0 pt-2 text-[32px] font-medium leading-[38px] tracking-normal text-[#1a1c1e]">
            이제 다시
            <br />
            작게 시작해요
          </h2>
          <p className="m-0 text-[18px] font-medium leading-[29px] text-[#42474d]">
            지금 할 수 있는 가장 작은 행동을 직접 적어보세요.
          </p>
        </section>

        <form
          id="next-action-form"
          onSubmit={handleSubmit}
          className="flex min-h-[294px] w-full flex-col rounded-[32px] border border-[#e2e8f0] bg-[linear-gradient(126.98deg,#f0fdf4_0%,#dcfce7_100%)] p-8 shadow-[0_10px_40px_-10px_rgba(60,95,124,0.08)]"
        >
          <label htmlFor="next-action" className="text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#2d6a4f]">
            복귀 행동
          </label>
          <input
            id="next-action"
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            maxLength={60}
            autoComplete="off"
            placeholder="예: 제목 1개만 고치기"
            className="mt-3 h-14 w-full rounded-2xl border border-[#bbdfca] bg-white px-4 text-[16px] font-medium text-[#1a1c1e] outline-none placeholder:text-[#8a9198] focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          />
          <p className="m-0 mt-2 text-[13px] font-medium leading-[18px] text-[#55705f]">
            2~3분 안에 끝낼 수 있을 만큼 작게 적어주세요.
          </p>

          <div className="mt-6 flex flex-col gap-6">
            {recoveryItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.label} className="flex h-[50px] items-start gap-4">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#2d6a4f] bg-white text-[#2d6a4f]">
                    <Icon size={14} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#2d6a4f]">
                      {item.label}
                    </span>
                    <p className="m-0 text-[18px] font-medium leading-7 text-[#1a1c1e]">{item.value}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </form>

        <aside className="flex h-[70px] w-full items-center gap-3 rounded-full border border-[#e2e2e5] bg-[#f4f3f6] p-4">
          <span className="flex w-[19.67px] shrink-0 justify-end">
            <Info size={16} strokeWidth={2.3} className="text-[#3c5f7c]" aria-hidden="true" />
          </span>
          <p className="m-0 max-w-[236px] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#42474d]">
            감정 리셋 후 원래 과업이 아니라 축소된 행동으로 복귀
          </p>
        </aside>
      </section>

      <div className="absolute bottom-0 left-0 z-[3] flex h-[172px] w-full flex-col gap-3 bg-[rgba(255,255,255,0.8)] px-5 pb-9 pt-6 backdrop-blur-[8px]">
        <button
          type="submit"
          form="next-action-form"
          disabled={!nextAction.trim()}
          className="flex h-[50px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#c2c7ce]"
        >
          3분 행동 시작
        </button>
        <Link
          href="/"
          className="flex h-[50px] w-full items-center justify-center rounded-full bg-[rgba(221,227,235,0.3)] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]"
        >
          오늘은 여기까지
        </Link>
      </div>
    </main>
  );
}
