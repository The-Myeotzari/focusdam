export const ACTIVE_FOCUS_SESSION_STORAGE_KEY = "focusdam:active-starter-action";

export type StoredFocusSession = {
  sessionId: string | null;
  starterActionId: string | null;
  scheduleId: string | null;
  title: string;
  subtitle: string | null;
  duration: number;
  plannedDurationMinutes: number;
  recommendedMinutes: number;
  startedAt: string;
  timerStartedAt: string;
};

export function readStoredFocusSession(): StoredFocusSession | null {
  try {
    const value = window.localStorage.getItem(ACTIVE_FOCUS_SESSION_STORAGE_KEY);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as Partial<StoredFocusSession>;

    if (!parsed.title || !parsed.startedAt) {
      return null;
    }

    const duration = getPositiveNumber(parsed.duration ?? parsed.recommendedMinutes, 10);

    return {
      sessionId: parsed.sessionId ?? null,
      starterActionId: parsed.starterActionId ?? null,
      scheduleId: parsed.scheduleId ?? null,
      title: parsed.title,
      subtitle: parsed.subtitle ?? null,
      duration,
      plannedDurationMinutes: getPositiveNumber(parsed.plannedDurationMinutes, duration),
      recommendedMinutes: getPositiveNumber(parsed.recommendedMinutes, duration),
      startedAt: parsed.startedAt,
      timerStartedAt: parsed.timerStartedAt ?? parsed.startedAt
    };
  } catch {
    return null;
  }
}

export function writeStoredFocusSession(session: StoredFocusSession) {
  window.localStorage.setItem(ACTIVE_FOCUS_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredFocusSession() {
  window.localStorage.removeItem(ACTIVE_FOCUS_SESSION_STORAGE_KEY);
}

function getPositiveNumber(value: number | undefined, fallback: number) {
  return Number.isFinite(value) && Number(value) > 0 ? Number(value) : fallback;
}
