"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";
import { createClient } from "@/shared/lib/supabase/client";
import {
  clearOnboardingDraft,
  updateOnboardingDraft
} from "@/shared/lib/onboarding-draft";

export function OnboardingAccountPage({ isLoginMode = false }: { isLoginMode?: boolean }) {
  const [requiredConsent, setRequiredConsent] = useState(true);
  const [optionalConsent, setOptionalConsent] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function signInWithKakao() {
    if ((!isLoginMode && !requiredConsent) || isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    setAuthError(null);

    try {
      const supabase = createClient();

      if (isLoginMode) {
        clearOnboardingDraft();

        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user) {
          window.location.replace("/home");
          return;
        }
      } else {
        updateOnboardingDraft({
          analysisUsage: optionalConsent,
          emotionRecord: optionalConsent
        });
      }

      const nextPath = isLoginMode ? "/home" : "/onboarding/complete";
      const callbackParams = new URLSearchParams({ next: nextPath });

      if (isLoginMode) {
        callbackParams.set("flow", "login");
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?${callbackParams.toString()}`,
          skipBrowserRedirect: true
        }
      });

      if (error) {
        throw error;
      }

      if (!data.url) {
        throw new Error("카카오 인증 주소를 받지 못했습니다.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error(error);
      setAuthError("카카오 로그인을 시작하지 못했어요. 설정을 확인해 주세요.");
      setIsSigningIn(false);
    }
  }

  return (
    <main
      aria-labelledby="account-title"
      className="mx-auto flex min-h-[100svh] w-full max-w-[var(--page-max-width)] flex-col items-center overflow-x-hidden bg-[#faf9fc] pb-16 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar
        title="집중이담"
        backHref={isLoginMode ? "/" : "/onboarding/notifications"}
        skipHref={isLoginMode ? undefined : "/"}
      />

      <section className="flex w-full flex-col items-center px-5 py-8 sm:py-12">
        <section className="flex w-full max-w-[672px] flex-col items-center gap-4 pb-12">
          <h2
            id="account-title"
            className="m-0 w-full break-keep pt-4 text-center text-[30px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e] sm:text-[32px]"
          >
            {isLoginMode ? "다시 만나 반가워요." : "데이터는 최소한으로만 사용해요."}
          </h2>
          <p className="m-0 w-full max-w-[290px] break-keep text-center text-[18px] font-medium leading-7 text-[#42474d]">
            {isLoginMode
              ? "가입할 때 사용한 카카오 계정으로 로그인해 주세요."
              : "필수 정보와 선택 정보를 분리하고, 선택동의는 언제든 철회할 수 있습니다."}
          </p>
        </section>

        {!isLoginMode ? (
          <section className="w-full max-w-[576px] pb-12" aria-label="개인정보 동의">
            <div className="isolate flex w-full flex-col items-start gap-6 rounded-[32px] bg-white p-6 shadow-[0_10px_40px_-10px_rgba(107,142,173,0.08)]">
              <div className="flex w-full flex-col gap-4">
                <ConsentRow
                  checked={requiredConsent}
                  onChange={setRequiredConsent}
                  title="[Required] 계정·서비스 이용 기록"
                  description="원활한 서비스 제공을 위해 반드시 필요한 정보입니다."
                />
                <ConsentRow
                  checked={optionalConsent}
                  onChange={setOptionalConsent}
                  title="[Optional] 집중·감정 기록 활용"
                  description="맞춤형 분석을 위해 사용되며 거부해도 서비스 이용이 가능합니다."
                />
              </div>

              <Link
                href="/"
                className="flex h-[35px] w-full items-end justify-between border-t border-[#e2e2e5] pt-4 text-[#42474d]"
              >
                <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px]">
                  약관 및 개인정보처리방침
                </span>
                <ExternalLink size={11} strokeWidth={2} />
              </Link>
            </div>
          </section>
        ) : null}

        <section
          className={[
            "flex w-full max-w-[448px] flex-col gap-4",
            isLoginMode ? "pt-4" : ""
          ].join(" ")}
        >
          <button
            type="button"
            disabled={(!isLoginMode && !requiredConsent) || isSigningIn}
            onClick={signInWithKakao}
            className="mx-auto inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FEE500] px-4 text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Image src="/kakao.png" alt="kakao" width={20} height={10} />
            {isSigningIn ? "Kakao로 이동 중..." : "Kakao로 로그인하기"}
          </button>

          {authError ? (
            <p role="alert" className="m-0 text-center text-[13px] font-medium leading-[18px] text-[#ba1a1a]">
              {authError}
            </p>
          ) : null}

          <div className="pt-[15.25px]">
            <p className="mx-auto m-0 w-full max-w-[320px] text-center text-[12px] font-medium leading-5 text-[#42474d]">
              {isLoginMode
                ? "기존에 저장한 동의 및 알림 설정은 로그인 후 그대로 유지됩니다."
                : "계속 진행함으로써 귀하는 집중이담의 서비스 이용약관에 동의하며 개인정보 보호를 위한 노력을 이해합니다."}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function ConsentRow({
  checked,
  onChange,
  title,
  description
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex min-h-14 w-full cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className="flex h-6 w-10 shrink-0 items-center pr-4">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${
            checked
              ? "border-[#3c5f7c] bg-[#3c5f7c] text-white"
              : "border-[#72777e] bg-transparent text-transparent"
          }`}
          aria-hidden="true"
        >
          <Check size={15} strokeWidth={3} />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">{title}</span>
        <span className="mt-0 text-[12px] font-medium leading-4 text-[#42474d] opacity-70">
          {description}
        </span>
      </span>
    </label>
  );
}
