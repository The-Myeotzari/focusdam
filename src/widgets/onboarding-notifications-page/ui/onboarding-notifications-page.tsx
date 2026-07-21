import type { ReactNode } from "react";
import { Clock3, Heart, WalletCards } from "lucide-react";
import { SiteButton, SiteTopBar } from "@/shared/ui";

const reminders = [
  {
    title: "오전 10시 착수 알림",
    description: "가장 집중이 잘 되는 시간이에요",
    icon: <Clock3 size={24} strokeWidth={2.2} />,
    enabled: true
  },
  {
    title: "결제 보류 24시간 리마인드",
    description: "잊고 있던 업무 비용을 챙겨드려요",
    icon: <WalletCards size={24} strokeWidth={2.2} />,
    enabled: false
  },
  {
    title: "감정 리셋 추천 알림",
    description: "번아웃 방지를 위한 짧은 휴식",
    icon: <Heart size={24} strokeWidth={2.2} />,
    enabled: true
  }
] as const;

export function OnboardingNotificationsPage() {
  return (
    <main
      aria-labelledby="notifications-title"
      className="flex min-h-[100svh] w-full flex-col items-center bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar title="집중이담" backHref="/onboarding/goal" skipHref="/onboarding/account" />

      <section className="flex w-full max-w-[1140px] flex-1 flex-col items-center px-5 pb-14 pt-10 sm:pt-12">
        <section className="flex w-full flex-col items-center gap-6 text-center">
          <h2
            id="notifications-title"
            className="m-0 w-full text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]"
          >
            언제 도와드릴까요?
          </h2>
          <p className="m-0 w-full max-w-[322px] break-keep text-[18px] font-medium leading-7 text-[#42474d]">
            당신의 집중 골든타임을 지키기 위해 꼭 필요한 알림만 보내드릴게요.
          </p>
        </section>

        <section className="mt-14 flex w-full flex-col gap-6" aria-label="추천 알림">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.title} {...reminder} />
          ))}
        </section>

        <section className="mt-12 flex w-full flex-col gap-4">
          <SiteButton
            href="/onboarding/account"
            className="!h-[68px] !min-h-[68px] !w-full !rounded-full !bg-[#3c5f7c] !px-0 !py-5 !text-[18px] !font-medium !leading-7 !text-white !shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2),0_8px_10px_-6px_rgba(60,95,124,0.2)]"
          >
            알림 켜기
          </SiteButton>
          <SiteButton
            href="/onboarding/account"
            variant="secondary"
            className="!h-14 !min-h-14 !w-full !rounded-full !bg-[#f0f1f5] !px-0 !py-4 !text-[16px] !font-medium !leading-6 !text-[#3c5f7c] !shadow-none"
          >
            나중에 할게요
          </SiteButton>
        </section>

        <p className="mt-auto mb-0 pt-16 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#b6b8bd]">
          © 2024 집중이담. All rights reserved.
        </p>
      </section>
    </main>
  );
}

function ReminderCard({
  title,
  description,
  icon,
  enabled
}: {
  title: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
}) {
  return (
    <article className="flex min-h-[116px] w-full items-center gap-3 rounded-[28px] bg-white px-4 py-5 sm:min-h-[128px] sm:gap-6 sm:rounded-[32px] sm:px-6">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eef2f6] text-[#3c5f7c]" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="m-0 break-keep text-[18px] font-medium leading-7 text-[#1a1c1e]">{title}</h3>
        <p className="m-0 mt-1 break-keep text-[16px] font-medium leading-6 text-[#7a7f86]">{description}</p>
      </div>
      <Toggle enabled={enabled} />
    </article>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`relative h-[22px] w-10 shrink-0 rounded-full ${enabled ? "bg-[#3c5f7c]" : "bg-[#c2c7ce]"}`}
      aria-hidden="true"
    >
      <span
        className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${
          enabled ? "right-0.5" : "left-0.5"
        }`}
      />
    </span>
  );
}
