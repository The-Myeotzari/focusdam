import Image from "next/image";
import { SiteButton } from "@/shared/ui";

export function OnboardingStartPage() {
  return (
    <main
      aria-labelledby="onboarding-start-title"
      className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col items-center overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden" aria-hidden="true">
        <span className="absolute -left-[39px] -top-[88px] h-[354px] w-[156px] rounded-full bg-[#cce5ff] opacity-[0.03] blur-[60px]" />
        <span className="absolute -right-5 top-[530px] h-[309px] w-[137px] rounded-full bg-[#ffddb6] opacity-[0.03] blur-[50px]" />
      </div>

      <section className="z-[1] flex min-h-[calc(100svh-66px)] w-full max-w-[600px] flex-1 flex-col items-center justify-center px-5 py-[82px]">
        <div className="relative isolate flex h-[320px] w-full max-w-[320px] items-center justify-center py-8" aria-hidden="true">
          <span className="absolute inset-0 -z-[1] rounded-full bg-[#cce5ff] opacity-10 blur-[32px]" />
          <span className="absolute inset-4 -z-[1] rounded-full bg-[#ffddb6] opacity-[0.05] blur-[20px]" />
          <div className="flex h-64 w-64 items-center justify-center rounded-[48px] bg-white p-8 shadow-[0_10px_30px_-5px_rgba(107,142,173,0.06)]">
            <Image
              className="h-48 w-48 object-contain opacity-90 mix-blend-multiply"
              src="/logo.svg"
              alt=""
              width={192}
              height={192}
              priority
            />
          </div>
        </div>

        <section className="flex w-44 max-w-[280px] flex-col items-center gap-4 pt-12 text-center">
          <h1
            id="onboarding-start-title"
            className="text-[32px] font-medium leading-[38px] tracking-[-0.8px] text-[#1a1c1e]"
          >
            집중이담
          </h1>
          <p className="text-[18px] font-medium leading-7 text-[#42474d]">
            실행·감정·소비·대화를 10분 단위로 가볍게 관리
          </p>
        </section>

        <div className="flex w-full flex-col items-center pt-12">
          <SiteButton
            href="/onboarding/reason"
            className="!min-h-14 !w-[280px] !max-w-full !rounded-full !bg-[#3c5f7c] !px-0 !py-4 !text-[16px] !font-medium !leading-6 !text-white !shadow-[0_10px_30px_-5px_rgba(107,142,173,0.06)]"
          >
            시작하기
          </SiteButton>
          <SiteButton
            href="/onboarding/account"
            variant="secondary"
            className="!mt-4 !min-h-14 !w-[280px] !max-w-full !rounded-full !bg-[rgba(221,227,235,0.3)] !px-0 !py-4 !text-[16px] !font-medium !leading-6 !text-[#3c5f7c] !shadow-[0_10px_30px_-5px_rgba(107,142,173,0.06)]"
          >
            이미 계정이 있어요
          </SiteButton>
        </div>
      </section>

      <footer className="z-[2] flex h-[66px] w-[203px] items-center pb-12 text-[#42474d] opacity-40">
        <ShieldIcon />
        <span className="whitespace-nowrap pl-2 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px]">
          Safe &amp; Supportive Sanctuary
        </span>
      </footer>
    </main>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-[15px] w-3 flex-[0_0_12px]" viewBox="0 0 12 15" aria-hidden="true">
      <path
        d="M6 0.75 10.5 2.4v3.7c0 3.45-1.85 6.55-4.5 8.15-2.65-1.6-4.5-4.7-4.5-8.15V2.4L6 0.75Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M4.2 7.1 5.35 8.25 8.1 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
