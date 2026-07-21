import type { ReactNode } from "react";
import { Check, Frown, Lightbulb, MessageSquare, ShoppingCart, Timer } from "lucide-react";
import { SiteButton, SiteTopBar } from "@/shared/ui";

const options = [
  {
    label: "시작을 못 하고 미뤄요",
    icon: <Timer size={24} strokeWidth={2} />
  },
  {
    label: "충동구매 후 후회해요",
    icon: <ShoppingCart size={24} strokeWidth={2} />
  },
  {
    label: "감정이 흔들리면 멈춰요",
    icon: <Frown size={24} strokeWidth={2} />
  },
  {
    label: "뭐라고 말할지 막혀요",
    icon: <MessageSquare size={24} strokeWidth={2} />
  }
] as const;

export function OnboardingReasonPage() {
  return (
    <main
      aria-labelledby="reason-title"
      className="isolate flex min-h-[100svh] w-full flex-col items-center bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar
        title="집중이담"
        backHref="/onboarding/start"
        skipHref="/onboarding/account"
        className="z-[1]"
      />

      <section className="z-0 flex w-full max-w-[1140px] flex-col items-start px-5 py-8">
        <section className="flex w-full max-w-[672px] flex-col items-center self-center gap-4 pb-10 sm:pb-12">
          <h2
            id="reason-title"
            className="m-0 w-full max-w-[302px] break-keep text-center text-[30px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e] sm:text-[32px]"
          >
            요즘 가장 자주 막히는 순간은?
          </h2>
          <p className="m-0 w-full max-w-[289px] break-keep text-center text-[17px] font-medium leading-7 text-[#42474d] sm:text-[18px]">
            진단 여부보다 실제 불편을 기준으로 첫 루틴을 추천합니다.
          </p>
        </section>

        <section className="grid w-full gap-6 pb-12" aria-label="문제 선택">
          {options.map((option) => (
            <OptionCard key={option.label} icon={option.icon}>
              {option.label}
            </OptionCard>
          ))}
        </section>

        <section className="flex min-h-[154px] w-full flex-col items-start justify-end pb-20">
          <article className="box-border flex min-h-32 w-full items-start gap-4 rounded-[28px] border border-[#c2c7ce] bg-[#faf9fc] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:rounded-[32px] sm:p-6">
            <span className="flex w-[15px] justify-center pt-1 text-[#946d3b]" aria-hidden="true">
              <Lightbulb size={20} fill="currentColor" strokeWidth={0} />
            </span>
            <p className="m-0 w-full max-w-[262px] text-[15px] font-medium leading-6 text-[#5f656c] sm:text-[16px] sm:leading-[26px]">
              선택하신 내용은 일상에서 가장 우선순위가 높은 &apos;긴급 개입&apos; 위젯으로 홈
              화면에 배치되어, 실질적인 행동 변화를 돕습니다.
            </p>
          </article>
        </section>

        <SiteButton
          href="/onboarding/safety"
          className="!h-[67px] !min-h-[67px] !w-full !rounded-full !bg-[#3c5f7c] !px-0 !py-5 !text-[18px] !font-medium !leading-[27px] !text-white !shadow-[0_10px_40px_-10px_rgba(107,142,173,0.15)]"
        >
          다음
        </SiteButton>
      </section>
    </main>
  );
}

function OptionCard({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <button
      type="button"
      className="box-border flex min-h-[96px] w-full cursor-pointer items-center gap-3 rounded-[28px] border border-[#c2c7ce] bg-white p-4 text-left font-inherit text-[#1a1c1e] sm:min-h-[106px] sm:gap-6 sm:rounded-[32px] sm:p-6"
    >
      <span className="flex h-12 w-12 flex-[0_0_48px] items-center justify-center rounded-full bg-[#dde3eb] text-[#3c5f7c] sm:h-14 sm:w-14 sm:flex-basis-[56px]" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1 text-[18px] font-medium leading-7 text-[#1a1c1e]">{children}</span>
      <span className="flex h-5 w-5 flex-[0_0_20px] items-center justify-center text-[#3c5f7c] opacity-0" aria-hidden="true">
        <Check size={20} strokeWidth={2} />
      </span>
    </button>
  );
}
