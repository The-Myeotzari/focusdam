import type { WeeklyReviewInsight, WeeklyReviewMetric } from '@/entities/review';

export function getMetricToneClassName(tone: WeeklyReviewMetric['tone']) {
  if (tone === 'success') {
    return 'bg-[var(--ds-success)] text-[var(--ds-success-ink)]';
  }

  if (tone === 'caution') {
    return 'bg-[var(--ds-caution)] text-[var(--ds-caution-ink)]';
  }

  if (tone === 'premium') {
    return 'bg-[var(--ds-premium)] text-[var(--ds-premium-ink)]';
  }

  return 'bg-[var(--color-surface-container-low)] text-[var(--color-primary)]';
}

export function getInsightAccentClassName(accent: WeeklyReviewInsight['accent']) {
  if (accent === 'orange') {
    return {
      section: 'bg-[#fff3df]',
      badge: 'bg-[#ffe2bd] text-[#9a650c]',
      icon: 'bg-white/65 text-[#9a650c]',
    };
  }

  if (accent === 'pink') {
    return {
      section: 'bg-[#fff5f7]',
      badge: 'bg-[#ffe2e9] text-[#9a4456]',
      icon: 'bg-white/70 text-[#9a4456]',
    };
  }

  if (accent === 'mint') {
    return {
      section: 'bg-[#eaf7f1]',
      badge: 'bg-[#d8f0e6] text-[#2d6a4f]',
      icon: 'bg-white/70 text-[#2d6a4f]',
    };
  }

  if (accent === 'purple') {
    return {
      section: 'bg-[#f1eff8]',
      badge: 'bg-[#e4def5] text-[#645785]',
      icon: 'bg-white/70 text-[#645785]',
    };
  }

  return {
    section: 'bg-[#eef5fb]',
    badge: 'bg-[#dcecf7] text-[#3c5f7c]',
    icon: 'bg-white/70 text-[#3c5f7c]',
  };
}
