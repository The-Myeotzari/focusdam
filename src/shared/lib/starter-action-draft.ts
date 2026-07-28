export const STARTER_ACTION_DRAFT_STORAGE_KEY = "focusdam:starter-action-draft";

export type StarterActionDraft = {
  title: string;
  subtitle: string | null;
  target: string | null;
  microAction: string | null;
  verb: string | null;
  category: string | null;
  templateId: string | null;
  source: "custom" | "template" | "recent" | "favorite" | "split";
  plannedDurationMinutes: number;
  recommendedDurationMinutes: number;
  isFavorite: boolean;
};

export const DEFAULT_STARTER_ACTION_DRAFT: StarterActionDraft = {
  title: "보고서 목차만 정리하기",
  subtitle: "초안만 만들기",
  target: null,
  microAction: null,
  verb: null,
  category: null,
  templateId: null,
  source: "custom",
  plannedDurationMinutes: 25,
  recommendedDurationMinutes: 10,
  isFavorite: false
};

export function readStarterActionDraft(): StarterActionDraft {
  try {
    const value = window.localStorage.getItem(STARTER_ACTION_DRAFT_STORAGE_KEY);
    const parsed = value ? (JSON.parse(value) as Partial<StarterActionDraft>) : {};

    return { ...DEFAULT_STARTER_ACTION_DRAFT, ...parsed };
  } catch {
    return DEFAULT_STARTER_ACTION_DRAFT;
  }
}

export function writeStarterActionDraft(draft: StarterActionDraft) {
  window.localStorage.setItem(STARTER_ACTION_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearStarterActionDraft() {
  window.localStorage.removeItem(STARTER_ACTION_DRAFT_STORAGE_KEY);
}
