"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  FileText,
  Plus,
  Sparkles,
  Timer
} from "lucide-react";

const SCHEDULED_STARTER_ACTIONS_STORAGE_KEY = "focusdam:scheduled-starter-actions";

type ScheduledStarterAction = {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  recommendedMinutes: number;
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
};

const fallbackActions: ScheduledStarterAction[] = [
  {
    id: "sample-report-outline",
    title: "보고서 목차만 정리하기",
    subtitle: "초안만 만들기",
    durationMinutes: 25,
    recommendedMinutes: 10,
    scheduledDate: getTodayDateValue(),
    scheduledTime: "",
    createdAt: ""
  }
];

export function FocusActionListPage() {
  const todayDate = getTodayDateValue();
  const [actions, setActions] = useState<ScheduledStarterAction[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [weekAnchorDate, setWeekAnchorDate] = useState(todayDate);

  useEffect(() => {
    try {
      const storedActions = window.localStorage.getItem(SCHEDULED_STARTER_ACTIONS_STORAGE_KEY);
      const parsedActions = storedActions ? (JSON.parse(storedActions) as ScheduledStarterAction[]) : [];

      setActions(parsedActions);
    } catch {
      setActions([]);
    }
  }, []);

  const selectedDateActions = actions.filter((action) => action.scheduledDate === selectedDate);
  const otherDayActionCount = actions.filter((action) => action.scheduledDate && action.scheduledDate !== selectedDate).length;
  const visibleActions = actions.length > 0 ? selectedDateActions : fallbackActions;
  const hasNoSelectedDateActions = actions.length > 0 && selectedDateActions.length === 0;
  const selectedDateLabel = formatDateLabel(selectedDate);
  const weekDates = getWeekDates(weekAnchorDate);
  const weekRangeLabel = formatWeekRangeLabel(weekDates);

  const moveWeek = (direction: -1 | 1) => {
    const nextAnchorDate = addDays(weekAnchorDate, direction * 7);

    setWeekAnchorDate(nextAnchorDate);
    setSelectedDate(addDays(selectedDate, direction * 7));
  };

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <span
        className="pointer-events-none absolute -right-24 top-[132px] h-72 w-72 rounded-full bg-[#cce5ff]/30 blur-[50px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -left-24 bottom-[96px] h-72 w-72 rounded-full bg-[#ffddb6]/25 blur-[56px]"
        aria-hidden="true"
      />

      <header className="relative z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/focus/complete"
          aria-label="완료 화면으로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="relative z-[1] flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-8">
        <section className="rounded-[36px] bg-white p-7 shadow-[0_24px_48px_-20px_rgba(60,95,124,0.18)]">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#e6f4f1] text-[#3d7068]">
            <Sparkles size={28} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h2 className="m-0 mt-6 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            한 날짜씩만
            <br />
            차분히 볼게요
          </h2>
          <p className="m-0 mt-4 text-[16px] font-medium leading-6 text-[#5f656c]">
            기본은 오늘 행동만 보여드려요. 다른 날짜가 필요하면 위에서 하루씩만 확인해요.
          </p>
        </section>

        <section className="mt-8 rounded-[32px] bg-white px-4 py-5 shadow-[0_14px_34px_rgba(107,142,173,0.07)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="m-0 text-[28px] font-medium leading-[35px] text-[#1a1c1e]">
                {selectedDate === todayDate ? "오늘" : formatShortDateTitle(selectedDate)}
              </p>
              <p className="m-0 mt-1 text-[15px] font-medium leading-6 text-[#5f656c]">
                {selectedDateLabel}
              </p>
              <p className="m-0 mt-0.5 text-[12px] font-medium leading-[18px] tracking-[0.48px] text-[#8f9196]">
                {weekRangeLabel}
              </p>
            </div>
            <Link
              href="/starter/new"
              className="flex h-9 items-center gap-1 rounded-full bg-[#3c5f7c1a] px-3 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]"
            >
              <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
              새 행동
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              aria-label="이전 주"
              onClick={() => moveWeek(-1)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#8f9196]"
            >
              <ChevronLeft size={20} strokeWidth={2.3} aria-hidden="true" />
            </button>

            <div className="grid flex-1 grid-cols-7 gap-1">
              {weekDates.map((date) => {
                const dateValue = formatDateValue(date);
                const selected = dateValue === selectedDate;
                const hasAction = actions.some((action) => action.scheduledDate === dateValue);

                return (
                  <button
                    key={dateValue}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedDate(dateValue)}
                    className={[
                      "relative flex min-h-[62px] flex-col items-center justify-center rounded-2xl pb-2 text-[13px] font-medium leading-[18px]",
                      selected ? "bg-[#3c5f7c] text-white" : "text-[#72777e]"
                    ].join(" ")}
                  >
                    <span className="font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[13px] font-semibold uppercase leading-[18px]">
                      {formatWeekday(date)}
                    </span>
                    <span className="mt-1 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[15px] font-medium leading-5">
                      {date.getDate()}
                    </span>
                    {hasAction ? (
                      <span
                        className={[
                          "absolute bottom-2 size-1.5 rounded-full",
                          selected ? "bg-white" : "bg-[#3c5f7c]"
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="다음 주"
              onClick={() => moveWeek(1)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#8f9196]"
            >
              <ChevronRight size={20} strokeWidth={2.3} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-[18px] font-medium leading-7 text-[#1a1c1e]">
                {selectedDate === todayDate ? "오늘 행동" : "이 날의 행동"}
              </h3>
              <p className="m-0 mt-0.5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#72777e]">
                {visibleActions.length}개의 행동
              </p>
            </div>
            {otherDayActionCount > 0 ? (
              <span className="rounded-full bg-[#e8edf3] px-3 py-1 text-[12px] font-medium leading-[18px] text-[#3c5f7c]">
                다른 날 {otherDayActionCount}
              </span>
            ) : null}
          </div>

          {hasNoSelectedDateActions ? (
            <section className="mt-4 flex flex-col items-center rounded-[28px] bg-[#faf9fc] px-6 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#e8edf3] text-[#3c5f7c]">
                <CalendarDays size={28} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <h4 className="m-0 mt-5 text-[22px] font-medium leading-8 text-[#1a1c1e]">
                이 날짜에 예정된 행동은 없어요
              </h4>
              <p className="m-0 mt-3 text-[15px] font-medium leading-6 text-[#72777e]">
                다른 날짜를 누르거나 새 행동을 만들어볼까요?
              </p>
            </section>
          ) : null}

          <section className="mt-4 flex flex-col gap-4" aria-label="선택한 날짜 예약 행동 목록">
            {visibleActions.map((action, index) => {
              const detailHref = `/focus/next-action?title=${encodeURIComponent(action.title)}&subtitle=${encodeURIComponent(
                action.subtitle
              )}&duration=${action.durationMinutes}&recommended=${action.recommendedMinutes}`;
              const scheduleText = formatSchedule(action);

              return (
                <Link
                  key={action.id}
                  href={detailHref}
                  className={[
                    "group relative isolate overflow-hidden rounded-[28px] p-5 transition-transform active:scale-[0.99]",
                    index === 0
                      ? "border-2 border-[#3c5f7c] bg-[#f3f7fa] shadow-[0_14px_34px_rgba(60,95,124,0.1)]"
                      : "border border-[#e1e4e8] bg-white shadow-[0_10px_24px_rgba(107,142,173,0.06)]"
                  ].join(" ")}
                >
                  {index === 0 ? (
                    <span
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(60,95,124,0.08)_0%,rgba(255,221,182,0.08)_100%)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative z-[1] flex items-start justify-between gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3c5f7c] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <FileText size={24} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex w-fit items-center rounded-full bg-[#3c5f7c1a] px-3 py-1 text-[12px] font-medium leading-[18px] text-[#3c5f7c]">
                        {index === 0 ? "먼저 할 행동" : "예약 행동"}
                      </span>
                      <strong className="mt-3 block text-[20px] font-medium leading-7 text-[#1a1c1e]">
                        {action.title}
                      </strong>
                      <span className="mt-1 block text-[15px] font-medium leading-6 text-[#5f656c]">
                        {action.subtitle}
                      </span>
                    </span>
                    <ChevronRight
                      size={22}
                      strokeWidth={2.5}
                      className="mt-8 shrink-0 text-[#c2c7ce] group-active:text-[#3c5f7c]"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative z-[1] mt-5 grid grid-cols-2 gap-3">
                    <span className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-3 text-[13px] font-medium leading-[18px] text-[#5f656c]">
                      <CalendarDays size={16} strokeWidth={2.4} className="text-[#3c5f7c]" aria-hidden="true" />
                      {scheduleText}
                    </span>
                    <span className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-3 text-[13px] font-medium leading-[18px] text-[#5f656c]">
                      <Timer size={16} strokeWidth={2.4} className="text-[#3c5f7c]" aria-hidden="true" />
                      추천 {action.recommendedMinutes}분
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>

          {actions.length === 0 ? (
            <p className="m-0 mt-5 rounded-[24px] bg-[#fff7ef] px-5 py-4 text-[14px] font-medium leading-6 text-[#8a6427]">
              아직 저장된 행동이 없어 샘플 행동을 보여주고 있어요. `행동 생성`을 누르면 예약한 날짜에 맞춰 하루씩 보여요.
            </p>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function formatSchedule(action: ScheduledStarterAction) {
  if (!action.scheduledDate || !action.scheduledTime) {
    return "오늘";
  }

  const date = new Date(`${action.scheduledDate}T${action.scheduledTime}`);

  if (Number.isNaN(date.getTime())) {
    return "예약됨";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getTodayDateValue() {
  const date = new Date();

  return formatDateValue(date);
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(date);
}

function formatShortDateTitle(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  })
    .format(date)
    .slice(0, 1);
}

function formatWeekRangeLabel(dates: Date[]) {
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  if (!firstDate || !lastDate) {
    return "";
  }

  const firstLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric"
  }).format(firstDate);
  const lastLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric"
  }).format(lastDate);

  return `${firstLabel} - ${lastLabel}`;
}

function getWeekDates(todayDateValue: string) {
  const today = new Date(`${todayDateValue}T00:00:00`);
  const day = today.getDay();
  const sunday = new Date(today);

  sunday.setDate(today.getDate() - day);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);

    return date;
  });
}

function addDays(dateValue: string, days: number) {
  const date = new Date(`${dateValue}T00:00:00`);

  date.setDate(date.getDate() + days);

  return formatDateValue(date);
}
