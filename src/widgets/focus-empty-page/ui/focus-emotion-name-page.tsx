import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

const emotions = [
  { label: "불안", description: "가슴 답답함" },
  { label: "짜증", description: "예민함" },
  { label: "무기력", description: "몸이 무거움" },
  { label: "수치심", description: "자기비난" }
] as const;

export function FocusEmotionNamePage() {
  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <EmotionNameTopBar />

      <section className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-[252px] pt-8">
        <section className="relative isolate flex h-[204px] w-full flex-col gap-3 overflow-hidden rounded-[32px] bg-[rgba(253,226,228,0.3)] p-8 shadow-[0_10px_40px_-10px_rgba(60,95,124,0.06)]">
          <span
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[rgba(253,226,228,0.2)] blur-[32px]"
            aria-hidden="true"
          />
          <h2 className="m-0 max-w-[286px] text-[32px] font-medium leading-[38px] tracking-normal text-[#1a1c1e]">
            지금 감정 이름을 붙여볼까요?
          </h2>
          <p className="m-0 max-w-[286px] text-[16px] font-medium leading-[26px] text-[#42474d]">
            정확하지 않아도 괜찮아요. 가장 가까운 감정을 고릅니다.
          </p>
        </section>

        <section className="flex w-full flex-col gap-4 pt-2" aria-label="감정 선택">
          {emotions.map((emotion) => (
            <EmotionOption key={emotion.label} {...emotion} />
          ))}
        </section>

        <aside className="flex h-[70px] w-full items-center gap-3 rounded-[32px] border border-[rgba(194,199,206,0.2)] bg-[#f4f3f6] p-4">
          <Info size={20} strokeWidth={2.3} className="shrink-0 text-[#595f66]" aria-hidden="true" />
          <p className="m-0 max-w-[240px] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#42474d]">
            감정 선택은 복수 선택 가능. 입력 부담을 낮추기 위해 선택형 우선
          </p>
        </aside>
      </section>

      <div className="absolute bottom-[var(--bottom-nav-height)] left-0 z-[2] flex h-[164px] w-full flex-col justify-end bg-[linear-gradient(0deg,#faf9fc_0%,#faf9fc_50%,rgba(250,249,252,0)_100%)] px-5 pb-10 pt-4">
        <div className="flex w-full flex-col gap-3">
          <Link
            href="/focus/emotion-reset/thought"
            className="flex h-14 w-full items-center justify-center rounded-[32px] bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white shadow-[0_10px_40px_-10px_rgba(60,95,124,0.06)]"
          >
            다음
          </Link>
          <Link
            href="/focus/current?duration=10"
            className="flex h-10 w-full items-center justify-center rounded-[32px] text-[16px] font-medium leading-6 text-[#3c5f7c]"
          >
            타이머로 돌아가기
          </Link>
        </div>
      </div>

    </main>
  );
}

function EmotionNameTopBar() {
  return (
    <header className="z-[3] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
      <Link
        href="/focus/emotion-reset"
        aria-label="이전 화면으로 돌아가기"
        className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
      >
        <ArrowLeft size={24} strokeWidth={2.3} />
      </Link>
      <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 tracking-normal text-[#3c5f7c]">
        마음 챙김
      </h1>
    </header>
  );
}

function EmotionOption({ label, description }: { label: string; description: string }) {
  return (
    <label className="flex h-[98px] w-full cursor-pointer items-center justify-between rounded-[32px] border border-[rgba(194,199,206,0.3)] bg-white p-6 shadow-[0_10px_40px_-10px_rgba(60,95,124,0.06)]">
      <span className="flex flex-col">
        <span className="text-[18px] font-medium leading-7 text-[#1a1c1e]">{label}</span>
        <span className="mt-0.5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#42474d]">
          {description}
        </span>
      </span>
      <input type="checkbox" className="sr-only" aria-label={`${label} 선택`} />
      <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#c2c7ce]" aria-hidden="true">
        <span className="size-2 rounded-full bg-white opacity-0" />
      </span>
    </label>
  );
}
