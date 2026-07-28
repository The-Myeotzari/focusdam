"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock3, FileText, ListTodo, Timer } from "lucide-react";
import { SiteTopBar } from "@/shared/ui";
import {
  readStoredFocusSession,
  writeStoredFocusSession
} from "@/shared/lib/focus-session-storage";

const SCHEDULED_STARTER_ACTIONS_STORAGE_KEY = "focusdam:scheduled-starter-actions";

type NextAction = {
  starterActionId?: string | null;
  scheduleId?: string | null;
  title: string;
  subtitle: string;
  duration: number;
  recommended: number;
};

type ActiveAction = NextAction & {
  startedAt: string;
};

type PreferredActionResult = {
  action: NextAction;
  activeAction: ActiveAction | null;
};

const DEFAULT_ACTION: NextAction = {
  title: "보고서 목차만 정리하기",
  subtitle: "초안만 만들기",
  duration: 25,
  recommended: 10
};

export function FocusNextActionPage() {
  const searchParams = useSearchParams();
  const requestedTitle = searchParams.get("title");
  const requestedSubtitle = searchParams.get("subtitle");
  const requestedDuration = searchParams.get("duration");
  const requestedRecommended = searchParams.get("recommended");
  const requestedStarterActionId = searchParams.get("starterActionId");
  const requestedScheduleId = searchParams.get("scheduleId");
  const [action, setAction] = useState<NextAction>(DEFAULT_ACTION);
  const [activeAction, setActiveAction] = useState<ActiveAction | null>(null);
  const [hasResolvedStoredAction, setHasResolvedStoredAction] = useState(false);

  useEffect(() => {
    if (requestedTitle) {
      setAction({
        starterActionId: requestedStarterActionId,
        scheduleId: requestedScheduleId,
        title: requestedTitle,
        subtitle: requestedSubtitle ?? DEFAULT_ACTION.subtitle,
        duration: parsePositiveNumber(requestedDuration, DEFAULT_ACTION.duration),
        recommended: parsePositiveNumber(requestedRecommended, DEFAULT_ACTION.recommended)
      });
      setActiveAction(null);
      setHasResolvedStoredAction(true);
      return;
    }

    let canceled = false;

    async function resolvePreferredAction() {
      try {
        const response = await fetch("/api/focus/sessions");

        if (response.ok) {
          const result = (await response.json()) as {
            session: {
              id: string;
              starterActionId: string | null;
              scheduleId: string | null;
              title: string;
              subtitle: string | null;
              plannedDurationMinutes: number;
              recommendedDurationMinutes: number | null;
              startedAt: string;
            } | null;
          };

          if (result.session && !canceled) {
            const storedSession = readStoredFocusSession();
            const isSameStoredSession = storedSession?.sessionId === result.session.id;
            const activeTimerDuration = isSameStoredSession
              ? storedSession.duration
              : result.session.recommendedDurationMinutes ??
                result.session.plannedDurationMinutes;
            const activeTimerStartedAt = isSameStoredSession
              ? storedSession.timerStartedAt
              : result.session.startedAt;
            const runningAction: ActiveAction = {
              starterActionId: result.session.starterActionId,
              scheduleId: result.session.scheduleId,
              title: result.session.title,
              subtitle: result.session.subtitle ?? "진행 중인 행동",
              duration: result.session.plannedDurationMinutes,
              recommended: activeTimerDuration,
              startedAt: activeTimerStartedAt
            };
            writeStoredFocusSession({
              sessionId: result.session.id,
              starterActionId: result.session.starterActionId,
              scheduleId: result.session.scheduleId,
              title: result.session.title,
              subtitle: result.session.subtitle,
              duration: runningAction.recommended,
              plannedDurationMinutes: runningAction.duration,
              recommendedMinutes: isSameStoredSession
                ? storedSession.recommendedMinutes
                : runningAction.recommended,
              startedAt: result.session.startedAt,
              timerStartedAt: activeTimerStartedAt
            });
            setAction(runningAction);
            setActiveAction(runningAction);
            setHasResolvedStoredAction(true);
            return;
          }
        }

        const from = new Date();
        from.setHours(0, 0, 0, 0);
        const to = new Date(from);
        to.setDate(to.getDate() + 14);
        const scheduleParams = new URLSearchParams({
          from: from.toISOString(),
          to: to.toISOString()
        });
        const schedulesResponse = await fetch(
          `/api/starter/schedules?${scheduleParams.toString()}`
        );

        if (schedulesResponse.ok) {
          const schedulesResult = (await schedulesResponse.json()) as {
            schedules: Array<{
              id: string;
              starterActionId: string;
              title: string;
              subtitle: string | null;
              plannedDurationMinutes: number;
              recommendedDurationMinutes: number;
            }>;
          };
          const nextSchedule = schedulesResult.schedules[0];

          if (nextSchedule && !canceled) {
            setAction({
              starterActionId: nextSchedule.starterActionId,
              scheduleId: nextSchedule.id,
              title: nextSchedule.title,
              subtitle: nextSchedule.subtitle ?? DEFAULT_ACTION.subtitle,
              duration: nextSchedule.plannedDurationMinutes,
              recommended: nextSchedule.recommendedDurationMinutes
            });
            setActiveAction(null);
            setHasResolvedStoredAction(true);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }

      if (!canceled) {
        const preferredAction = getPreferredStoredAction();
        setAction(preferredAction.action);
        setActiveAction(preferredAction.activeAction);
        setHasResolvedStoredAction(true);
      }
    }

    void resolvePreferredAction();

    return () => {
      canceled = true;
    };
  }, [
    requestedDuration,
    requestedRecommended,
    requestedScheduleId,
    requestedStarterActionId,
    requestedSubtitle,
    requestedTitle
  ]);

  if (!requestedTitle && !hasResolvedStoredAction) {
    return <FocusActionLoadingShell />;
  }

  if (!requestedTitle && activeAction) {
    return <ActiveActionResumePage action={activeAction} />;
  }

  const { title, subtitle, duration, recommended } = action;
  const startParams = new URLSearchParams({
    duration: `${recommended}`,
    plannedDuration: `${duration}`,
    title,
    subtitle
  });

  if (action.starterActionId) {
    startParams.set("starterActionId", action.starterActionId);
  }

  if (action.scheduleId) {
    startParams.set("scheduleId", action.scheduleId);
  }

  const startHref = `/focus/current?${startParams.toString()}`;

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[var(--page-max-width)] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <section className="mx-auto flex min-h-[100svh] w-[calc(100%_-_2rem)] max-w-[560px] flex-col overflow-hidden rounded-[48px] border-8 border-[#eeedf0] bg-[#faf9fc] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <SiteTopBar title="마음 챙김" backHref="/focus/actions" />

        <section className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-8 pt-8">
          <section className="relative isolate flex min-h-52 w-full flex-col items-start overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_20px_40px_-10px_rgba(60,95,124,0.06)] sm:rounded-[32px] sm:p-8">
            <span
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(60,95,124,0.05)_0%,rgba(60,95,124,0)_100%)]"
              aria-hidden="true"
            />
            <div className="relative z-[1] flex w-full flex-col gap-2">
              <span className="flex h-[26px] w-fit items-center rounded-full bg-[#3c5f7c1a] px-3 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
                현재 작업
              </span>
              <h2 className="m-0 pt-2 text-[28px] font-medium leading-[35px] text-[#1a1c1e]">
                {title}
              </h2>
              <p className="m-0 flex items-center gap-2 text-[16px] font-medium leading-6 text-[#42474d]">
                <FileText size={15} strokeWidth={2.4} aria-hidden="true" />
                {subtitle}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <article className="flex min-h-[88px] items-center gap-4 rounded-[32px] bg-[#f4f3f6] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3c5f7c] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <Clock3 size={24} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-medium leading-6 text-[#72777e]">예상시간</span>
                <span className="text-[20px] font-medium leading-7 text-[#1a1c1e]">{duration}분</span>
              </span>
            </article>

            <article className="flex min-h-[92px] items-center gap-4 rounded-[32px] border-2 border-[#dde1e6] bg-[#f4f3f6] p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#3c5f7c] text-white">
                <Timer size={24} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-medium leading-6 text-[#3c5f7c]">추천 실행</span>
                <span className="text-[20px] font-medium leading-7 text-[#3c5f7c]">{recommended}분</span>
              </span>
            </article>
          </section>

          <section className="mt-auto flex flex-col items-center gap-6">
            <span className="h-1 w-16 rounded-full bg-[#e8e8ea]" aria-hidden="true" />
            <p className="m-0 w-full max-w-[420px] text-center text-[18px] font-medium leading-7 text-[#8f9196]">
              &quot;완벽함보다 완성이 중요합니다. 가벼운 마음으로 시작해보세요.&quot;
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <Link
              href={startHref}
              className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_14px_26px_rgba(60,95,124,0.15)]"
            >
              시작
            </Link>
            <Link
              href="/starter/recent"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#e8edf3] text-[16px] font-medium leading-6 text-[#5f656c]"
            >
              행동 바꾸기
            </Link>
          </section>
        </section>
      </section>
    </main>
  );
}

function ActiveActionResumePage({ action }: { action: ActiveAction }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const startedAt = Date.parse(action.startedAt);
  const elapsedSeconds = Number.isFinite(startedAt)
    ? Math.max(Math.floor((now - startedAt) / 1000), 0)
    : 0;
  const totalSeconds = action.recommended * 60;
  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const baseParams = new URLSearchParams({
    duration: `${action.recommended}`,
    plannedDuration: `${action.duration}`,
    title: action.title,
    subtitle: action.subtitle
  });

  if (action.starterActionId) {
    baseParams.set("starterActionId", action.starterActionId);
  }

  if (action.scheduleId) {
    baseParams.set("scheduleId", action.scheduleId);
  }

  const resumeParams = new URLSearchParams(baseParams);
  resumeParams.set("resume", "1");
  const resumeHref = `/focus/current?${resumeParams.toString()}`;
  const restartHref = `/focus/current?${baseParams.toString()}`;

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[var(--page-max-width)] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <section className="mx-auto flex min-h-[100svh] w-[calc(100%_-_2rem)] max-w-[560px] flex-col overflow-hidden rounded-[48px] border-8 border-[#eeedf0] bg-[#faf9fc] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <SiteTopBar title="마음 챙김" backHref="/home" />

        <section className="flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-10">
          <header className="text-center">
            <h2 className="m-0 break-keep text-[32px] font-medium leading-[42px] tracking-[-0.32px] text-[#1a1c1e] sm:text-[36px]">
              이어 하던 행동이 있어요
            </h2>
            <p className="m-0 mt-4 text-[16px] font-medium leading-7 text-[#72777e] sm:text-[18px]">
              앱을 나간 동안에도 타이머가 유지됐습니다.
            </p>
          </header>

          <section className="relative mx-auto mt-12 flex size-64 items-center justify-center" aria-label="남은 시간">
            <span className="absolute inset-3 rounded-full bg-white shadow-[0_22px_46px_rgba(107,142,173,0.12)]" />
            <svg className="absolute inset-0 size-64 -rotate-90" viewBox="0 0 256 256" aria-hidden="true">
              <circle cx="128" cy="128" r={radius} fill="none" stroke="#e6ebf0" strokeWidth="3" />
              <circle
                cx="128"
                cy="128"
                r={radius}
                fill="none"
                stroke="#557896"
                strokeLinecap="round"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
              />
            </svg>
            <div className="relative z-[1] text-center">
              <p className="m-0 text-[15px] font-medium leading-6 tracking-[1.2px] text-[#557896]">남은 시간</p>
              <p className="m-0 mt-2 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[52px] font-semibold leading-[56px] tracking-[-2px] text-[#557896]">
                {formatRemainingTime(remainingSeconds)}
              </p>
            </div>
          </section>

          <section className="mt-12 rounded-[32px] bg-white p-5 shadow-[0_18px_38px_rgba(107,142,173,0.08)]">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#cce5ff] text-[#254a66]">
                <ListTodo size={26} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[14px] font-medium leading-5 text-[#72777e]">현재 행동</p>
                <h3 className="m-0 mt-1 break-keep text-[20px] font-medium leading-7 text-[#1a1c1e]">
                  {action.title}
                </h3>
              </div>
            </div>
          </section>

          <section className="mt-4 grid grid-cols-2 gap-4">
            <article className="rounded-[28px] bg-white p-5 shadow-[0_12px_28px_rgba(107,142,173,0.06)]">
              <p className="m-0 text-[14px] font-medium leading-5 text-[#72777e]">마지막 활동</p>
              <p className="m-0 mt-2 flex items-center gap-2 text-[18px] font-medium leading-7 text-[#1a1c1e]">
                <Clock3 size={18} strokeWidth={2.2} className="text-[#aeb4bc]" aria-hidden="true" />
                {formatElapsedTime(elapsedSeconds)}
              </p>
            </article>
            <article className="rounded-[28px] bg-white p-5 shadow-[0_12px_28px_rgba(107,142,173,0.06)]">
              <p className="m-0 text-[14px] font-medium leading-5 text-[#72777e]">상태</p>
              <p className="m-0 mt-2 flex items-center gap-2 text-[18px] font-medium leading-7 text-[#1a1c1e]">
                <span className="size-3 rounded-full bg-[#a67734]" aria-hidden="true" />
                진행 중
              </p>
            </article>
          </section>

          <section className="mt-auto grid grid-cols-2 gap-3 pt-12">
            <Link
              href={resumeHref}
              className="col-span-2 flex h-[68px] items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white shadow-[0_14px_26px_rgba(60,95,124,0.15)]"
            >
              이어서 하기
            </Link>
            <Link
              href={restartHref}
              className="flex h-14 items-center justify-center rounded-full bg-[#dde3eb] text-[15px] font-medium leading-6 text-[#3c5f7c]"
            >
              처음부터
            </Link>
            <Link
              href="/focus/actions"
              className="flex h-14 items-center justify-center rounded-full bg-[#f4f3f6] text-[15px] font-medium leading-6 text-[#5f656c]"
            >
              행동 목록
            </Link>
          </section>
        </section>
      </section>
    </main>
  );
}

function FocusActionLoadingShell() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[var(--page-max-width)] flex-col bg-[#faf9fc]">
      <SiteTopBar title="마음 챙김" backHref="/focus/actions" />
    </main>
  );
}

function getPreferredStoredAction(): PreferredActionResult {
  try {
    const storedFocusSession = readStoredFocusSession();

    if (storedFocusSession) {
      const activeAction = storedFocusSession;

      if (activeAction.title) {
        const action = {
          starterActionId: activeAction.starterActionId,
          scheduleId: activeAction.scheduleId,
          title: activeAction.title,
          subtitle: activeAction.subtitle ?? "진행 중인 행동",
          duration: parsePositiveNumber(activeAction.duration, DEFAULT_ACTION.duration),
          recommended: parsePositiveNumber(
            activeAction.recommendedMinutes,
            DEFAULT_ACTION.recommended
          )
        };

        return {
          action,
          activeAction: {
            ...action,
            startedAt: activeAction.startedAt ?? new Date().toISOString()
          }
        };
      }
    }

    const scheduledActionsValue = window.localStorage.getItem(SCHEDULED_STARTER_ACTIONS_STORAGE_KEY);
    const scheduledActions = scheduledActionsValue
      ? (JSON.parse(scheduledActionsValue) as Array<Partial<{
          title: string;
          subtitle: string;
          durationMinutes: number;
          recommendedMinutes: number;
        }>>)
      : [];
    const highestPriorityAction = Array.isArray(scheduledActions)
      ? scheduledActions.find((storedAction) => Boolean(storedAction.title))
      : undefined;

    if (highestPriorityAction?.title) {
      return {
        action: {
          title: highestPriorityAction.title,
          subtitle: highestPriorityAction.subtitle ?? DEFAULT_ACTION.subtitle,
          duration: parsePositiveNumber(highestPriorityAction.durationMinutes, DEFAULT_ACTION.duration),
          recommended: parsePositiveNumber(
            highestPriorityAction.recommendedMinutes,
            DEFAULT_ACTION.recommended
          )
        },
        activeAction: null
      };
    }
  } catch {
    return { action: DEFAULT_ACTION, activeAction: null };
  }

  return { action: DEFAULT_ACTION, activeAction: null };
}

function parsePositiveNumber(value: string | number | null | undefined, fallback: number) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${`${minutes}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;
}

function formatElapsedTime(elapsedSeconds: number) {
  if (elapsedSeconds < 60) {
    return "방금 전";
  }

  return `${Math.floor(elapsedSeconds / 60)}분 전`;
}
