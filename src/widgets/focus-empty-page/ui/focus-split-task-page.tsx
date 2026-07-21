"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const MAX_REASON_LENGTH = 50;
const RECENT_STARTER_ACTIONS_STORAGE_KEY = "focusdam:recent-starter-actions";
const ACTIVE_STARTER_ACTION_STORAGE_KEY = "focusdam:active-starter-action";

export function FocusSplitTaskPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [nextAction, setNextAction] = useState("");

  const handleSave = () => {
    const fallbackTitle = "보고서 목차만 정리하기";
    const title = nextAction.trim() || reason.trim() || fallbackTitle;

    try {
      const storedActions = window.localStorage.getItem(RECENT_STARTER_ACTIONS_STORAGE_KEY);
      const parsedActions = storedActions ? (JSON.parse(storedActions) as string[]) : [];
      const nextActions = [title, ...parsedActions.filter((action) => action !== title)].slice(0, 5);

      window.localStorage.setItem(RECENT_STARTER_ACTIONS_STORAGE_KEY, JSON.stringify(nextActions));
    } catch {
      window.localStorage.setItem(RECENT_STARTER_ACTIONS_STORAGE_KEY, JSON.stringify([title]));
    }

    window.localStorage.removeItem(ACTIVE_STARTER_ACTION_STORAGE_KEY);
    router.push("/starter/recent");
  };

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-y-auto bg-[#faf9fc] pb-28 font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute -left-24 top-[356px] h-[360px] w-[180px] rounded-full bg-[#cce5ff]/35 blur-[42px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-24 top-[470px] h-[360px] w-[180px] rounded-full bg-[#ffddb6]/25 blur-[48px]"
        aria-hidden="true"
      />

      <SiteTopBar title="마음 챙김" backHref="/focus/overtime" className="sticky top-0 z-[3]" />

      <section className="relative z-[1] flex flex-col items-center px-5 pb-8 pt-14">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-[#ffddb6] text-[#8a6427]">
          <Lightbulb size={34} strokeWidth={2.6} aria-hidden="true" />
        </span>

        <section className="mt-10 flex flex-col items-center text-center">
          <h2 className="m-0 w-[286px] text-[32px] font-medium leading-[42px] tracking-[-0.32px] text-[#3c5f7c]">
            왜 어려웠는지 남기면 다음 행동을 더 작게 바꿉니다.
          </h2>
          <p className="m-0 mt-8 w-[312px] text-[18px] font-medium leading-8 text-[#42474d]">
            가끔은 첫 발을 떼는 것조차 버거울 때가 있습니다. 자책하지 말고, 지금의 마음을 아주 조금만 가볍게 만들어볼까요?
          </p>
        </section>

        <section className="mt-8 flex w-full flex-col gap-8">
          <ReflectionCard
            label="어려웠던 이유"
            value={reason}
            placeholder="예: 사업계획서 목차 항목 이름 수정"
            onChange={setReason}
          />
          <ReflectionCard
            label="다음에 더 작게 할 행동"
            value={nextAction}
            placeholder="예: 사업계획서 목차 항목 이름 수정"
            onChange={setNextAction}
          />
        </section>

        <section className="mt-14 flex w-full flex-col items-center">
          <button
            type="button"
            onClick={handleSave}
            className="flex h-[66px] w-full items-center justify-center rounded-[32px] bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_12px_24px_rgba(60,95,124,0.14)]"
          >
            완료하고 저장
          </button>
        </section>
      </section>

    </main>
  );
}

function ReflectionCard({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-h-[220px] w-full flex-col rounded-[28px] border border-[#e8e8ea] bg-white px-6 pb-6 pt-7 shadow-[0_18px_36px_rgba(60,95,124,0.05)]">
      <span className="sr-only">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_REASON_LENGTH))}
        placeholder={placeholder}
        rows={3}
        className="min-h-[116px] w-full resize-none border-0 bg-transparent p-0 text-[24px] font-medium leading-9 tracking-[-0.24px] text-[#1a1c1e] outline-none placeholder:text-[#dde1e6]"
      />
      <span className="mt-auto h-px w-full bg-[#f1f2f4]" aria-hidden="true" />
      <span className="mt-5 text-[16px] font-medium leading-6 text-[#72777e]">
        {value.length}/{MAX_REASON_LENGTH}
      </span>
    </label>
  );
}
