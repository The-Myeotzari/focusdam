import { Bell, CircleHelp, Database, Sparkles, UserRound } from 'lucide-react';

import type { SettingsMenuSection } from '@/widgets/settings-menu';

// 설정 홈 메뉴 데이터
export const SETTINGS_MENU_SECTIONS: SettingsMenuSection[] = [
  {
    title: '내 정보',
    items: [
      {
        href: '/settings/account',
        title: '계정 관리',
        description: '계정 정보와 동의 내역을 관리해요.',
        icon: UserRound,
        tone: 'primary',
      },
    ],
  },
  {
    title: '서비스 설정',
    items: [
      {
        href: '/settings/notifications',
        title: '알림 설정',
        description: '필요한 알림만 받아볼 수 있어요.',
        icon: Bell,
        tone: 'success',
      },
      {
        href: '/settings/data',
        title: '데이터 관리',
        description: '기록과 저장된 데이터를 관리해요.',
        icon: Database,
        tone: 'caution',
      },
      {
        href: '/settings/plus',
        title: 'Plus 구독 관리',
        description: '구독 상태와 혜택을 확인해요.',
        icon: Sparkles,
        tone: 'premium',
      },
    ],
  },
  {
    title: '지원',
    items: [
      {
        href: '/settings/help',
        title: '도움말 및 피드백',
        description: '도움말을 확인하고 의견을 남겨보세요.',
        icon: CircleHelp,
        tone: 'safety',
      },
    ],
  },
];
