"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Pencil
} from "lucide-react";

const ACTIVE_STARTER_ACTION_STORAGE_KEY = "focusdam:active-starter-action";
const SCHEDULED_STARTER_ACTIONS_STORAGE_KEY = "focusdam:scheduled-starter-actions";

export function StarterTimePage() {
  const router = useRouter();
  const defaultSchedule = useMemo(() => getRoundedScheduleDate(), []);
  const [scheduledDate, setScheduledDate] = useState(formatDateValue(defaultSchedule));
  const [scheduledTime, setScheduledTime] = useState(formatTimeValue(defaultSchedule));
  const [showActiveActionAlert, setShowActiveActionAlert] = useState(false);
  const scheduledDateTime = useMemo(() => {
    return new Date(`${scheduledDate}T${scheduledTime}`);
  }, [scheduledDate, scheduledTime]);
  const displayDate = useMemo(() => formatDisplayDate(scheduledDateTime), [scheduledDateTime]);
  const displayTime = useMemo(() => formatDisplayTime(scheduledDateTime), [scheduledDateTime]);
  const timerHref = `/focus/current?scheduledAtDate=${scheduledDate}&scheduledAtTime=${scheduledTime}&duration=10`;

  const startAction = () => {
    router.push(timerHref);
  };

  const handleStartClick = () => {
    const activeAction = window.localStorage.getItem(ACTIVE_STARTER_ACTION_STORAGE_KEY);

    if (activeAction) {
      setShowActiveActionAlert(true);
      return;
    }

    startAction();
  };

  const handleConfirmStart = () => {
    window.localStorage.removeItem(ACTIVE_STARTER_ACTION_STORAGE_KEY);
    setShowActiveActionAlert(false);
    startAction();
  };

  const handleCreateAction = () => {
    const nextAction = {
      id: `${Date.now()}`,
      title: "보고서 목차만 정리하기",
      subtitle: "초안만 만들기",
      durationMinutes: 25,
      recommendedMinutes: 10,
      scheduledDate,
      scheduledTime,
      createdAt: new Date().toISOString()
    };

    try {
      const storedActions = window.localStorage.getItem(SCHEDULED_STARTER_ACTIONS_STORAGE_KEY);
      const parsedActions = storedActions ? (JSON.parse(storedActions) as typeof nextAction[]) : [];

      window.localStorage.setItem(
        SCHEDULED_STARTER_ACTIONS_STORAGE_KEY,
        JSON.stringify([nextAction, ...parsedActions].slice(0, 20))
      );
    } catch {
      window.localStorage.setItem(SCHEDULED_STARTER_ACTIONS_STORAGE_KEY, JSON.stringify([nextAction]));
    }

    router.push("/focus/actions");
  };

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[116px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[2] flex h-16 w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/starter/new"
          aria-label="이전 화면으로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-8 text-[16px] font-medium leading-6 text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="flex flex-1 flex-col px-5 pt-[72px]">
        <section className="flex flex-col items-center text-center">
          <h2 className="m-0 text-[32px] font-medium leading-[38px] tracking-[-0.32px] text-[#1a1c1e]">
            얼마나 걸릴 것 같나요?
          </h2>
          <p className="m-0 mt-2 text-[16px] font-medium leading-6 text-[#42474d]">
            압박감 없이, 지금 가능한 만큼만 계획해 보세요.
          </p>
        </section>

        <section className="mt-[72px] flex flex-col gap-6" aria-label="시간 설정">
          <button
            type="button"
            className="flex min-h-[220px] w-full flex-col items-start rounded-[32px] border border-[#c2c7ce] bg-white px-8 py-8 text-left shadow-[0_20px_40px_-10px_rgba(107,142,173,0.06)]"
          >
            <span className="flex w-full items-start justify-between">
              <span className="rounded-full bg-[rgba(148,109,59,0.15)] px-4 py-1.5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#785526]">
                추천
              </span>
              <Lightbulb size={26} strokeWidth={2.5} className="text-[#72777e]" aria-hidden="true" />
            </span>
            <span className="mt-6 font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[40px] font-semibold leading-[48px] tracking-[-0.8px] text-[#3c5f7c]">
              추천 10분
            </span>
            <span className="mt-3 w-[240px] text-[16px] font-medium leading-[26px] text-[#42474d]">
              가볍게 시작하기 가장 좋은 시간입니다. 부담 없이 첫 걸음을 떼어보세요.
            </span>
          </button>

          <button
            type="button"
            className="flex min-h-[248px] w-full flex-col items-start rounded-[32px] border border-[#3c5f7c33] bg-white px-8 py-8 text-left shadow-[0_30px_60px_-15px_rgba(60,95,124,0.08)]"
          >
            <span className="flex w-full items-center justify-between">
              <span className="rounded-full bg-[#5578961a] px-4 py-1.5 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
                내 계획
              </span>
              <Pencil size={22} strokeWidth={2.8} className="text-[#557896]" aria-hidden="true" />
            </span>
            <span className="mt-6 flex items-center gap-4">
              <span className="flex h-16 w-24 items-center justify-center rounded-[32px] bg-[#f4f3f6] font-['Hanken_Grotesk','42dot_Sans',sans-serif] text-[40px] font-semibold leading-[48px] tracking-[-0.8px] text-[#3c5f7c]">
                25
              </span>
              <span className="text-[40px] font-medium leading-[48px] text-[#1a1c1e]">분</span>
            </span>
            <span className="mt-8 text-[16px] font-medium leading-6 text-[#42474d]">
              나만의 속도로 진행하고 싶을 때 추천해요.
            </span>
          </button>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#c2c7ce4d] bg-white px-6 py-5 shadow-[0_10px_40px_rgba(107,142,173,0.04)]">
          <p className="m-0 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#3c5f7c]">
            실행 예약
          </p>
          <p className="m-0 mt-1 text-[14px] font-medium leading-5 text-[#72777e]">
            이 행동을 시작할 날짜와 시간을 정해주세요.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="rounded-3xl bg-[#f4f3f6] px-4 py-3">
              <span className="block text-[12px] font-medium leading-[18px] text-[#72777e]">날짜</span>
              <input
                type="date"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
                className="mt-1 h-8 w-full bg-transparent text-[15px] font-medium leading-6 text-[#1a1c1e] outline-none"
              />
            </label>
            <label className="rounded-3xl bg-[#f4f3f6] px-4 py-3">
              <span className="block text-[12px] font-medium leading-[18px] text-[#72777e]">시간</span>
              <input
                type="time"
                value={scheduledTime}
                onChange={(event) => setScheduledTime(event.target.value)}
                className="mt-1 h-8 w-full bg-transparent text-[15px] font-medium leading-6 text-[#1a1c1e] outline-none"
              />
            </label>
          </div>
          <p className="m-0 mt-4 rounded-3xl bg-[#5578961a] px-4 py-3 text-[15px] font-medium leading-6 text-[#3c5f7c]">
            {displayDate} {displayTime}에 시작할게요.
          </p>
        </section>

        <section className="mt-12 flex flex-col gap-4" aria-label="행동 시작">
          <button
            type="button"
            onClick={handleStartClick}
            className="flex h-[54px] w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-[34px] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          >
            행동 바로 시작
          </button>
          <button
            type="button"
            onClick={handleCreateAction}
            className="flex h-[54px] w-full items-center justify-center rounded-full bg-[#dde3eb] text-[18px] font-medium leading-7 text-[#5f656c]"
          >
            행동 생성
          </button>
          <Link
            href="/starter/new"
            className="flex h-14 w-full items-center justify-center rounded-full text-[16px] font-medium leading-6 text-[#595f66]"
          >
            행동 다시 선택
          </Link>
        </section>
      </section>

      {showActiveActionAlert ? (
        <section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="active-action-alert-title"
          aria-describedby="active-action-alert-description"
          className="fixed inset-0 z-[10] flex items-center justify-center bg-[#1a1c1e]/35 px-6"
        >
          <div className="w-full max-w-[342px] rounded-[32px] bg-white p-6 text-center shadow-[0_24px_60px_rgba(26,28,30,0.18)]">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff3e8] text-[#8a6427]">
              <AlertTriangle size={26} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h2
              id="active-action-alert-title"
              className="m-0 mt-5 text-[20px] font-medium leading-7 text-[#1a1c1e]"
            >
              진행 중인 행동을 중단할까요?
            </h2>
            <p
              id="active-action-alert-description"
              className="m-0 mt-3 text-[15px] font-medium leading-6 text-[#5f656c]"
            >
              바로 시작하면 지금 진행 중인 행동은 중단되고, 새 행동으로 타이머가 시작됩니다.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white"
              >
                중단하고 새로 시작
              </button>
              <button
                type="button"
                onClick={() => setShowActiveActionAlert(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#e8e8ea] text-[16px] font-medium leading-6 text-[#42474d]"
              >
                계속 진행하기
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function getRoundedScheduleDate() {
  const date = new Date();
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 10) * 10;

  date.setMinutes(roundedMinutes, 0, 0);

  return date;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeValue(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function formatDisplayTime(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}
