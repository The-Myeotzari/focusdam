import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  EyeOff,
  Home,
  ListChecks,
  Settings,
  Tag,
  Timer
} from "lucide-react";

const steps = [
  {
    label: "Step 1",
    title: "판단 중지: 지금 평가하지 않기",
    icon: EyeOff
  },
  {
    label: "Step 2",
    title: "감정 이름: 불안/짜증/무기력",
    icon: Tag
  },
  {
    label: "Step 3",
    title: "다음 행동: 목차 1개만 쓰기",
    icon: ListChecks
  }
] as const;

export function FocusEmotionResetPage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-24 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute -left-7 top-[126px] h-60 w-40 rounded-full bg-[#fff1f2]/40 blur-[30px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-7 bottom-[-80px] h-80 w-56 rounded-full bg-[#3c5f7c0d] blur-[40px]"
        aria-hidden="true"
      />

      <header className="relative z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/focus/current?duration=10"
          aria-label="타이머로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="relative z-[1] flex flex-1 flex-col items-center overflow-y-auto px-8 pb-10 pt-8">
        <section className="flex h-[218px] w-full flex-col items-center justify-center" aria-label="집중 유지 타이머">
          <div className="relative isolate flex h-48 w-48 items-center justify-center">
            <svg className="absolute inset-0 h-48 w-48 -rotate-90" viewBox="0 0 192 192" aria-hidden="true">
              <circle cx="96" cy="96" r="88" fill="none" stroke="#eeedf0" strokeWidth="6" />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#557896"
                strokeDasharray="64 54"
                strokeLinecap="butt"
                strokeWidth="6"
              />
            </svg>
            <p className="relative z-[1] m-0 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[32px] font-semibold leading-[38px] tracking-[-0.8px] text-[#a7caec]">
              05:58
            </p>
          </div>
          <p className="m-0 mt-2 text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#72777e]">
            집중 유지 중
          </p>
        </section>

        <section className="mt-10 flex w-full flex-col rounded-[32px] border border-[#fff1f2] bg-white p-6 shadow-[0_20px_40px_-5px_rgba(225,29,72,0.04)]">
          <h2 className="m-0 text-[16px] font-medium leading-6 text-[#3c5f7c]">
            감정이 올라왔나요?
          </h2>
          <p className="m-0 mt-2 text-[16px] font-medium leading-6 text-[#42474d]">
            15초 리셋 후 같은 행동으로 돌아옵니다.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.label}
                  className="flex min-h-[98px] w-full items-center rounded-[32px] bg-[#fff0f2] p-4"
                >
                  <span className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#ec2f5f] shadow-[0_10px_30px_-10px_rgba(107,142,173,0.08)]">
                    <Icon size={20} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#f05a7b]">
                      {step.label}
                    </span>
                    <span className="mt-0.5 text-[16px] font-medium leading-6 text-[#1a1c1e]">
                      {step.title}
                    </span>
                  </span>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white"
            >
              15초 리셋 시작
            </button>
            <Link
              href="/focus/current?duration=10"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#dde3eb]/50 text-[16px] font-medium leading-6 text-[#5f656c]"
            >
              타이머로 돌아가기
            </Link>
          </div>
        </section>
      </section>

      <EmotionResetBottomNav />
    </main>
  );
}

function EmotionResetBottomNav() {
  const items = [
    { label: "홈", icon: Home, href: "/", active: false },
    { label: "기록", icon: CalendarDays, href: "/starter/new", active: false },
    { label: "타이머", icon: Timer, href: "/focus/current?duration=10", active: true },
    { label: "설정", icon: Settings, href: "/settings", active: false }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 z-[3] flex h-20 w-full max-w-[390px] -translate-x-1/2 items-center justify-center gap-[27.8px] rounded-t-[32px] bg-white px-[29.91px] shadow-[0_-8px_30px_rgba(60,95,124,0.05)]">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={[
              "flex flex-col items-center justify-center px-4 py-1.5 text-[13px] font-medium leading-[18px] tracking-[0.52px]",
              item.active ? "h-[51px] w-[67px] rounded-full bg-[#557896] text-[#fcfcff]" : "h-12 text-[#5f656c]"
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Icon size={item.active ? 21 : 20} strokeWidth={2.3} aria-hidden="true" />
            <span className="mt-0.5 whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
