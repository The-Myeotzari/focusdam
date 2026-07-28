"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

import {
  clearOnboardingDraft,
  readOnboardingDraft
} from "@/shared/lib/onboarding-draft";

export function OnboardingCompletePage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;
    const draft = readOnboardingDraft();

    async function completeOnboarding() {
      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisUsage: draft.analysisUsage,
            emotionRecord: draft.emotionRecord,
            startReminder: draft.startReminder,
            spendHold: draft.spendHold,
            emotionReset: draft.emotionReset
          })
        });

        if (!response.ok) {
          throw new Error("온보딩 설정 저장에 실패했습니다.");
        }

        clearOnboardingDraft();
        router.replace("/home");
      } catch (completionError) {
        console.error(completionError);
        setError("설정을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    }

    void completeOnboarding();
  }, [retryCount, router]);

  const retry = () => {
    hasStarted.current = false;
    setError(null);
    setRetryCount((current) => current + 1);
  };

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-[var(--page-max-width)] flex-col items-center justify-center bg-[#faf9fc] px-5 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-[#e6f4f1] text-[#3d7068]">
        {error ? (
          <Check size={34} strokeWidth={2.6} aria-hidden="true" />
        ) : (
          <LoaderCircle size={34} strokeWidth={2.6} className="animate-spin" aria-hidden="true" />
        )}
      </span>
      <h1 className="m-0 mt-8 text-[30px] font-medium leading-[38px] text-[#1a1c1e]">
        {error ? "마지막 저장이 필요해요" : "나에게 맞게 준비하고 있어요"}
      </h1>
      <p className="m-0 mt-4 max-w-[320px] text-[16px] font-medium leading-6 text-[#72777e]">
        {error ?? "선택한 동의와 알림 설정을 안전하게 저장하고 있습니다."}
      </p>
      {error ? (
        <button
          type="button"
          onClick={retry}
          className="mt-8 flex h-14 w-full max-w-[320px] items-center justify-center rounded-full bg-[#3c5f7c] text-[16px] font-medium text-white"
        >
          다시 시도
        </button>
      ) : null}
    </main>
  );
}
