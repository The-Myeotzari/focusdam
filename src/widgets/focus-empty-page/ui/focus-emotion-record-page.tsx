"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cloud, Info, Play, Sun } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";
import { readStoredFocusSession } from "@/shared/lib/focus-session-storage";

const summarySteps = [
  {
    label: "리셋 전",
    value: "불안 · 수치심",
    icon: Cloud,
    iconClassName: "bg-[#ffdad6] text-[#93000a]"
  },
  {
    label: "리셋 후",
    value: "조금 나아짐",
    icon: Sun,
    iconClassName: "bg-[#cce5ff] text-[#001e31]"
  },
  {
    label: "행동 전환",
    value: "3분 행동 시작",
    icon: Play,
    iconClassName: "bg-[#ffddb6] text-[#2a1800]"
  }
] as const;

export function FocusEmotionRecordPage() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState("3분 행동 시작");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedEmotions = window.localStorage.getItem("focusdam:emotion-reset-emotions");
      setEmotions(storedEmotions ? (JSON.parse(storedEmotions) as string[]) : []);
    } catch {
      setEmotions([]);
    }

    setNextAction(
      window.localStorage.getItem("focusdam:emotion-reset-next-action") ?? "3분 행동 시작"
    );
  }, []);

  const saveRecord = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    const session = readStoredFocusSession();
    const thoughtPattern = window.localStorage.getItem(
      "focusdam:emotion-reset-thought-pattern"
    );
    const balancedThought = window.localStorage.getItem(
      "focusdam:emotion-reset-balanced-thought"
    );

    try {
      const response = await fetch("/api/focus/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.sessionId ?? null,
          emotionLabel: emotions.length > 0 ? emotions.join(" · ") : "기타",
          intensity: 3,
          triggerNote: [thoughtPattern, balancedThought, note.trim()]
            .filter(Boolean)
            .join(" / ") || null,
          resetAction: nextAction,
          returnedToFocus: true
        })
      });

      if (!response.ok) {
        throw new Error("감정 기록 저장에 실패했습니다.");
      }

      if (session?.sessionId) {
        await fetch(`/api/focus/sessions/${session.sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "emotion_reset_completed"
          })
        });
      }

      const params = new URLSearchParams({
        duration: "3",
        plannedDuration: "3",
        title: nextAction,
        subtitle: "감정 리셋 후 복귀 행동"
      });
      router.push(`/focus/current?${params.toString()}`);
    } catch (error) {
      console.error(error);
      setSaveError("기록을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setIsSaving(false);
    }
  };

  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-2 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="마음 챙김" backHref="/focus/emotion-reset/restart" className="z-[1]" />

      <section className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-[168px]">
        <section className="flex h-44 w-full flex-col gap-4 pt-8">
          <h2 className="m-0 text-[32px] font-medium leading-10 tracking-normal text-[#1a1c1e]">
            리셋 후 행동으로
            <br />
            돌아왔어요
          </h2>
          <p className="m-0 text-[16px] font-medium leading-6 text-[#42474d]">
            감정 리셋이 실행 복귀에 도움이 되었는지 짧게 남깁니다.
          </p>
        </section>

        <section className="relative h-[324px] w-full" aria-label="감정 리셋 요약">
          <span className="absolute bottom-8 left-6 top-8 w-px bg-[rgba(194,199,206,0.3)]" aria-hidden="true" />
          <div className="relative z-[1] flex flex-col gap-6">
            {summarySteps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.label} className="flex h-[92px] items-center gap-6">
                  <span
                    className={[
                      "flex size-12 shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
                      step.iconClassName
                    ].join(" ")}
                  >
                    <Icon size={23} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  <div className="flex h-[92px] flex-1 flex-col gap-1 rounded-[32px] border border-[rgba(194,199,206,0.2)] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <span className="text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#72777e]">
                      {step.label}
                    </span>
                    <p className="m-0 text-[18px] font-medium leading-7 text-[#1a1c1e]">{step.value}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="flex h-[210px] w-full flex-col gap-4 rounded-[32px] bg-[#f4f3f6] p-6">
          <h3 className="m-0 text-[13px] font-medium uppercase leading-[18px] tracking-[0.65px] text-[#42474d]">
            나의 한 줄 소감
          </h3>
          <div className="relative h-32 w-full rounded-[32px] bg-white p-4">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={300}
              placeholder="리셋 후의 기분을 간단히 적어보세요..."
              className="h-full w-full resize-none bg-transparent text-[16px] font-medium leading-6 text-[#42474d] outline-none placeholder:text-[rgba(114,119,126,0.5)]"
            />
            <div className="absolute bottom-3 right-4 flex gap-2">
              <span className="rounded-full bg-[rgba(221,227,235,0.5)] px-3 py-1 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#5f656c]">
                #평온
              </span>
              <span className="rounded-full bg-[rgba(221,227,235,0.5)] px-3 py-1 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#5f656c]">
                #집중
              </span>
            </div>
          </div>
        </section>

        <aside className="flex h-[68px] w-full items-start gap-3 rounded-[32px] bg-[rgba(204,229,255,0.2)] p-4">
          <Info size={20} strokeWidth={2.3} className="shrink-0 text-[#557896]" aria-hidden="true" />
          <p className="m-0 max-w-[240px] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#254a66]">
            리포트의 감정 복귀율과 사고오류 빈도에 반영됩니다.
          </p>
        </aside>
      </section>

      <div className="absolute bottom-0 left-0 z-[2] flex h-[168px] w-full flex-col gap-3 rounded-t-[32px] bg-[rgba(255,255,255,0.8)] px-5 pb-5 pt-6 shadow-[0_-8px_30px_rgba(60,95,124,0.08)] backdrop-blur-[12px]">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void saveRecord()}
          className="flex h-[60px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_10px_15px_-3px_rgba(60,95,124,0.2),0_4px_6px_-4px_rgba(60,95,124,0.2)]"
        >
          {isSaving ? "저장 중..." : "기록 저장"}
        </button>
        <Link
          href="/focus/emotion-reset/restart"
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-[rgba(221,227,235,0.5)] text-[18px] font-medium leading-7 text-[#5f656c]"
        >
          수정
        </Link>
        {saveError ? (
          <p role="alert" className="m-0 text-center text-[12px] font-medium text-[#ba1a1a]">
            {saveError}
          </p>
        ) : null}
      </div>
    </main>
  );
}
