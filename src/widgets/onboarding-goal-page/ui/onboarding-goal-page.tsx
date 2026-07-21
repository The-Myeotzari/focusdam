import type { ReactNode } from "react";
import { ArrowRight, Hand, Heart, Medal, Sparkles } from "lucide-react";
import { SiteButton, SiteTopBar } from "@/shared/ui";

const goals = [
  {
    eyebrow: "SUCCESS GOAL",
    title: "주 4회 10분 착수",
    icon: <Sparkles size={22} strokeWidth={2.2} />,
    iconClassName: "bg-[rgba(72,191,145,0.12)] text-[#2d6a4f]",
    eyebrowClassName: "text-[#2d6a4f]",
    titleClassName: "font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] font-bold"
  },
  {
    eyebrow: "FOCUS CONTROL",
    title: "결제 보류 3회",
    icon: <Hand size={22} strokeWidth={2.2} />,
    iconClassName: "bg-[rgba(245,158,11,0.12)] text-[#92400e]",
    eyebrowClassName: "text-[#92400e]",
    titleClassName: "font-medium"
  },
  {
    eyebrow: "EMOTIONAL CARE",
    title: "감정 리셋 후 복귀 2회",
    icon: <Heart size={20} strokeWidth={2.2} />,
    iconClassName: "bg-[rgba(244,63,94,0.12)] text-[#9f1239]",
    eyebrowClassName: "text-[#9f1239]",
    titleClassName: "font-medium"
  }
] as const;

export function OnboardingGoalPage() {
  return (
    <main
      aria-labelledby="goal-title"
      className="relative flex min-h-[100svh] w-full flex-col items-center overflow-x-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar
        title="집중이담"
        backHref="/onboarding/safety"
        skipHref="/onboarding/account"
        className="z-[4]"
      />

      <section className="flex w-full max-w-[1140px] flex-col items-start px-5 pb-8 pt-8">
        <section className="flex w-full flex-col items-start gap-4 pb-12">
          <h2
            id="goal-title"
            className="m-0 w-full break-keep text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]"
          >
            처음 2주는 작게 시작해요.
          </h2>
          <div className="flex w-full flex-col items-start gap-[4.5px]">
            <p className="m-0 w-full max-w-[360px] text-[18px] font-medium leading-7 text-[#42474d]">
              큰 목표보다 반복 가능한 기준을 먼저 정합니다.
            </p>
            <p className="m-0 w-full text-[18px] font-medium leading-7 text-[#42474d] opacity-70">
              괜찮아요, 작게 시작하면 됩니다.
            </p>
          </div>
        </section>

        <section className="flex w-full flex-col items-start gap-4 pb-12" aria-label="첫 목표 추천">
          {goals.map((goal) => (
            <GoalCard key={goal.title} {...goal} />
          ))}
        </section>

        <section className="flex w-full flex-col items-start pb-8">
          <article className="box-border flex min-h-32 w-full items-start gap-4 rounded-[28px] border border-[rgba(60,95,124,0.1)] bg-[rgba(204,229,255,0.3)] p-5 sm:rounded-[32px] sm:p-6">
            <span className="flex h-5 w-2.5 flex-[0_0_10px] items-start justify-center text-[#557896]" aria-hidden="true">
              <Medal size={20} strokeWidth={2} />
            </span>
            <p className="m-0 w-full max-w-[222px] text-[16px] font-medium leading-[26px] text-[#254a66]">
              첫 목표 달성 시, 고도화된 집중력 리포트와 함께 프리미엄 웰니스 엠블럼이 수여됩니다.
            </p>
          </article>
        </section>

        <div className="flex h-[108px] w-full flex-col items-start pt-5">
          <SiteButton
            href="/onboarding/notifications"
            className="!flex !h-[68px] !min-h-[68px] !w-full !items-center !justify-center !gap-3 !rounded-full !bg-[#3c5f7c] !px-0 !py-5 !text-[18px] !font-medium !leading-7 !text-white !shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2),0_8px_10px_-6px_rgba(60,95,124,0.2)]"
          >
            <span>이 목표로 시작</span>
            <ArrowRight size={16} strokeWidth={2.2} />
          </SiteButton>
        </div>
      </section>
    </main>
  );
}

function GoalCard({
  eyebrow,
  title,
  icon,
  iconClassName,
  eyebrowClassName,
  titleClassName
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  iconClassName: string;
  eyebrowClassName: string;
  titleClassName: string;
}) {
  return (
    <article className="box-border flex min-h-[100px] w-full flex-col items-start rounded-[28px] bg-[#f4f3f6] p-5 sm:rounded-[32px] sm:p-6">
      <div className="flex h-[50px] w-full items-center gap-4">
        <span className={`flex h-12 w-12 flex-[0_0_48px] items-center justify-center rounded-full ${iconClassName}`} aria-hidden="true">
          {icon}
        </span>
        <div className="flex flex-1 flex-col items-start gap-1">
          <p className={`m-0 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold uppercase leading-[18px] tracking-[0.65px] ${eyebrowClassName}`}>
            {eyebrow}
          </p>
          <h3 className={`m-0 text-[18px] leading-7 text-[#1a1c1e] ${titleClassName}`}>
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}
