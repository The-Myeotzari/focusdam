import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ACTIVE_FOCUS_SESSION_STORAGE_KEY,
  readStoredFocusSession,
  writeStoredFocusSession
} from "./focus-session-storage";

describe("focus session storage", () => {
  const values = new Map<string, string>();

  beforeEach(() => {
    values.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key)
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("전체 세션 시작 시각과 현재 타이머 시작 시각을 각각 보존한다", () => {
    writeStoredFocusSession({
      sessionId: "session-1",
      starterActionId: null,
      scheduleId: null,
      title: "보고서 목차 쓰기",
      subtitle: null,
      duration: 5,
      plannedDurationMinutes: 10,
      recommendedMinutes: 10,
      startedAt: "2026-07-28T10:00:00.000Z",
      timerStartedAt: "2026-07-28T10:10:00.000Z"
    });

    expect(readStoredFocusSession()).toMatchObject({
      duration: 5,
      plannedDurationMinutes: 10,
      recommendedMinutes: 10,
      startedAt: "2026-07-28T10:00:00.000Z",
      timerStartedAt: "2026-07-28T10:10:00.000Z"
    });
  });

  it("기존 저장 데이터는 세션 시작 시각을 타이머 시작 시각으로 사용한다", () => {
    values.set(
      ACTIVE_FOCUS_SESSION_STORAGE_KEY,
      JSON.stringify({
        title: "기존 행동",
        duration: 10,
        plannedDurationMinutes: 10,
        recommendedMinutes: 10,
        startedAt: "2026-07-28T10:00:00.000Z"
      })
    );

    expect(readStoredFocusSession()?.timerStartedAt).toBe(
      "2026-07-28T10:00:00.000Z"
    );
  });
});
