import type { ReactNode } from "react";
import { BriefcaseMedical, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { SiteButton, SiteTopBar } from "@/shared/ui";

const safetyItems = [
  {
    title: "의료행위 아님",
    description:
      "본 서비스는 의학적 진단이나 치료를 대체하지 않습니다. 전문적인 의료 지원이 필요한 경우 전문가와 상담하시기 바랍니다.",
    icon: <BriefcaseMedical size={20} strokeWidth={2} />,
    iconClassName: "bg-[rgba(85,120,150,0.1)] text-[#3c5f7c]"
  },
  {
    title: "민감정보는 선택 수집",
    description:
      "사용자가 직접 입력하는 집중 데이터 및 감정 기록은 서비스 고도화와 맞춤형 인사이트 제공을 위해서만 안전하게 사용됩니다.",
    icon: <ShieldAlert size={20} strokeWidth={2} />,
    iconClassName: "bg-[rgba(148,109,59,0.1)] text-[#785526]"
  },
  {
    title: "언제든 데이터 삭제 가능",
    description:
      "계정 설정 메뉴를 통해 기록된 모든 데이터를 즉시 삭제할 수 있으며, 요청 시 모든 정보는 복구 불가능하게 파기됩니다.",
    icon: <Trash2 size={20} strokeWidth={2} />,
    iconClassName: "bg-[#dde3eb] text-[#595f66]"
  }
] as const;

export function OnboardingSafetyPage() {
  return (
    <main
      aria-labelledby="safety-title"
      className="mx-auto flex min-h-[100svh] w-[min(100%,390px)] flex-col items-center bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar title="안전 고지" backHref="/onboarding/reason" skipHref="/onboarding/account" variant="leading" />

      <section className="flex min-h-[calc(100svh-56px)] w-full max-w-[600px] flex-col items-start justify-between px-5 py-8">
        <div>
          <section className="flex w-full flex-col items-start pb-12">
            <div className="isolate flex w-full flex-col items-center">
              <div className="z-[1] flex h-56 w-48 flex-col items-start pb-8">
                <div className="relative isolate flex h-48 w-48 items-center justify-center">
                  <span className="absolute inset-[-9.6px] -z-[1] rounded-full bg-[#cce5ff] opacity-20 blur-[32px]" />
                  <div className="flex h-32 w-32 rotate-[3deg] items-center justify-center rounded-[48px] bg-white text-[#3c5f7c] shadow-[0_30px_60px_rgba(107,142,173,0.05)]">
                    <ShieldCheck size={50} strokeWidth={2.2} className="rotate-[3deg]" />
                  </div>
                </div>
              </div>
              <h2
                id="safety-title"
                className="m-0 w-[252px] text-center text-[32px] font-medium leading-10 tracking-[-0.32px] text-[#3c5f7c]"
              >
                집중이담은 자기관리 보조 도구예요
              </h2>
            </div>
          </section>

          <section className="flex w-full flex-col items-start pb-12" aria-label="안전 고지 내용">
            <div className="flex w-full flex-col items-start gap-6">
              {safetyItems.map((item) => (
                <SafetyCard key={item.title} {...item} />
              ))}
            </div>
          </section>
        </div>

        <section className="flex w-full flex-col items-start gap-6">
          <SiteButton
            href="/onboarding/goal"
            className="!h-[67px] !min-h-[67px] !w-full !rounded-full !bg-[#3c5f7c] !px-0 !py-5 !text-[18px] !font-medium !leading-[27px] !text-white !shadow-[0_10px_40px_-10px_rgba(107,142,173,0.15)]"
          >
            확인했어요
          </SiteButton>
          <p className="mx-auto m-0 w-60 text-center text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#42474d]">
            계속 진행함으로써 집중이담의 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </section>
      </section>
    </main>
  );
}

function SafetyCard({
  title,
  description,
  icon,
  iconClassName
}: {
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
}) {
  return (
    <article className="box-border flex min-h-[177px] w-full items-start gap-5 rounded-[32px] border border-[rgba(194,199,206,0.3)] bg-white p-6 shadow-[0_30px_60px_rgba(107,142,173,0.05)]">
      <span className={`flex h-11 w-11 flex-[0_0_44px] items-center justify-center rounded-full p-3 ${iconClassName}`} aria-hidden="true">
        {icon}
      </span>
      <div className="flex flex-1 flex-col items-start gap-1">
        <h3 className="m-0 text-[18px] font-medium leading-[27px] text-[#1a1c1e]">{title}</h3>
        <p className="m-0 text-[16px] font-medium leading-6 text-[#42474d]">{description}</p>
      </div>
    </article>
  );
}
