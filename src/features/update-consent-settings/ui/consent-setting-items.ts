// 선택 동의 설정 아이템 정의 및 상수

import type { LucideIcon } from 'lucide-react';
import { ChartNoAxesCombined, ReceiptText, Smile } from 'lucide-react';

import type { ConsentSettingId } from '@/entities/consent-settings';

type ConsentSettingListItem = {
  type: 'toggle';
  id: ConsentSettingId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const CONSENT_SETTING_ITEMS: ConsentSettingListItem[] = [
  {
    type: 'toggle',
    id: 'emotionRecord',
    label: '감정 기록',
    description: '선택 동의',
    icon: Smile,
  },
  {
    type: 'toggle',
    id: 'spendingRecord',
    label: '소비 기록',
    description: '선택 동의',
    icon: ReceiptText,
  },
  {
    type: 'toggle',
    id: 'analysisUsage',
    label: '분석 활용',
    description: '익명 통계 데이터',
    icon: ChartNoAxesCombined,
  },
];
