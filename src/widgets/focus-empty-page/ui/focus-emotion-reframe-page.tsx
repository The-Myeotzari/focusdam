"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrainCog, Info, Scale, Sparkles } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

export function FocusEmotionReframePage() {
  const router = useRouter();
  const [balancedThought, setBalancedThought] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedThought = balancedThought.trim();
    if (!trimmedThought) return;

    window.localStorage.setItem("focusdam:emotion-reset-balanced-thought", trimmedThought);
    router.push("/focus/emotion-reset/restart");
  }

  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[132.5px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="마음 챙김" backHref="/focus/emotion-reset/thought" className="z-[2]" />

      <section className="flex flex-1 flex-col gap-10 overflow-y-auto px-5 pb-[176px] pt-8">
        <section className="flex h-[199px] w-full flex-col items-center gap-4 text-center">
          <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-4 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#047857]">
            <Sparkles size={16.5} fill="#047857" strokeWidth={2.3} aria-hidden="true" />
            생각 리프레이밍
          </span>
          <h2 className="m-0 max-w-[225px] text-[32px] font-medium leading-10 tracking-normal text-[#1a1c1e]">
            생각을 조금 더 현실적으로 바꿔요
          </h2>
          <p className="m-0 max-w-[289px] text-[18px] font-medium leading-[29px] text-[#42474d]">
            지금 필요한 건 완벽한 긍정이 아니라 다음 행동을 가능하게 하는 문장입니다.
          </p>
        </section>

        <form id="balanced-thought-form" onSubmit={handleSubmit} className="flex w-full flex-col gap-6" aria-label="생각 리프레이밍 비교">
          <article className="flex h-24 w-full items-center rounded-[32px] bg-[#f4f3f6] p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8e8ea] text-[#72777e]">
                <BrainCog size={21} strokeWidth={2.3} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#72777e]">
                  원래 생각
                </span>
                <p className="m-0 text-[16px] font-medium leading-6 text-[#1a1c1e]">
                  다 망한 것 같아
                </p>
              </div>
            </div>
          </article>

          <article className="relative isolate flex min-h-[184px] w-full overflow-hidden rounded-[32px] border-2 border-[#d1fae5] bg-white p-8 shadow-[0_10px_40px_-10px_rgba(107,142,173,0.06)]">
            <span
              className="pointer-events-none absolute -right-[46px] -top-[46px] h-32 w-32 rounded-full bg-[#ecfdf5] opacity-60 blur-[32px]"
              aria-hidden="true"
            />
            <div className="relative z-[1] flex w-full items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d1fae5] text-[#059669]">
                <Scale size={21} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor="balanced-thought" className="text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#059669]">
                  균형 문장 직접 작성
                </label>
                <textarea
                  id="balanced-thought"
                  value={balancedThought}
                  onChange={(event) => setBalancedThought(event.target.value)}
                  maxLength={120}
                  placeholder="조금 더 현실적인 문장으로 바꿔보세요."
                  className="min-h-24 w-full resize-none rounded-2xl border border-[#d1fae5] bg-[#f8fffb] p-3 text-[16px] font-medium leading-[22px] text-[#1a1c1e] outline-none placeholder:text-[#8a9198] focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15"
                />
              </div>
            </div>
          </article>
        </form>

        <aside className="flex h-[70px] w-full items-center gap-3 rounded-[48px] border border-[#e8e8ea] bg-white px-6 py-4">
          <Info size={18} strokeWidth={2.3} className="shrink-0 text-[#3c5f7c]" aria-hidden="true" />
          <p className="m-0 max-w-[226px] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#42474d]">
            완벽하게 긍정적일 필요 없이, 다음 행동을 가능하게 하는 현실적인 문장으로 적어보세요.
          </p>
        </aside>
      </section>

      <div className="absolute bottom-0 left-0 z-[3] flex h-[183px] w-full flex-col border-t border-[#eeedf0] bg-[rgba(255,255,255,0.8)] px-5 py-6 backdrop-blur-[6px]">
        <div className="flex w-full flex-col gap-3">
          <button
            type="submit"
            form="balanced-thought-form"
            disabled={!balancedThought.trim()}
            className="flex h-[60px] w-full items-center justify-center rounded-full bg-[#3c5f7c] px-8 text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(60,95,124,0.2),0_4px_6px_-4px_rgba(60,95,124,0.2)] disabled:cursor-not-allowed disabled:bg-[#c2c7ce] disabled:shadow-none"
          >
            다음 행동 만들기
          </button>
          <Link
            href="/focus/emotion-reset/thought"
            className="flex h-[62px] w-full items-center justify-center rounded-full border border-[#c2c7ce] px-8 text-[18px] font-medium leading-7 text-[#42474d]"
          >
            다시 작성
          </Link>
        </div>
      </div>
    </main>
  );
}
