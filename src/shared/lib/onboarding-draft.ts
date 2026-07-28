export const ONBOARDING_DRAFT_STORAGE_KEY = "focusdam:onboarding-draft";

export type OnboardingDraft = {
  reason?: string;
  goal?: string;
  analysisUsage: boolean;
  emotionRecord: boolean;
  startReminder: boolean;
  spendHold: boolean;
  emotionReset: boolean;
};

export const DEFAULT_ONBOARDING_DRAFT: OnboardingDraft = {
  analysisUsage: false,
  emotionRecord: false,
  startReminder: true,
  spendHold: false,
  emotionReset: true
};

export function readOnboardingDraft(): OnboardingDraft {
  try {
    const value = window.localStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
    const parsed = value ? (JSON.parse(value) as Partial<OnboardingDraft>) : {};

    return { ...DEFAULT_ONBOARDING_DRAFT, ...parsed };
  } catch {
    return DEFAULT_ONBOARDING_DRAFT;
  }
}

export function updateOnboardingDraft(patch: Partial<OnboardingDraft>) {
  const nextDraft = { ...readOnboardingDraft(), ...patch };
  window.localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));

  return nextDraft;
}

export function clearOnboardingDraft() {
  window.localStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
}
