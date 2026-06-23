import {
  Bell,
  BriefcaseMedical,
  CircleHelp,
  Database,
  FileText,
  FlaskConical,
  Info,
  ListChecks,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  SquareLibrary,
  Trash2,
  UserRound,
} from 'lucide-react';

import type {
  HelpFeedbackItem,
  SettingsMenuItemType,
  SettingsMenuSection,
} from './settings-menu.types';

// 설정 홈 메뉴 데이터
export const SETTINGS_MENU_SECTIONS: SettingsMenuSection[] = [
  {
    id: 'my-info',
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
    id: 'service-settings',
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
    id: 'support',
    title: '지원',
    items: [
      {
        href: '/settings/terms-safety',
        title: '약관·안전 안내',
        description: '서비스 약관과 안전 안내를 확인해요.',
        icon: ShieldCheck,
        tone: 'safety',
      },
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

// 계정 관리 메뉴 데이터
export const ACCOUNT_SETTINGS_MENU_SECTIONS: SettingsMenuSection[] = [
  {
    id: 'account-settings',
    title: '계정 설정',
    items: [
      {
        href: '/settings/account/consent',
        title: '선택 동의 관리',
        description: '선택 동의 항목을 확인하고 변경해요.',
        icon: ListChecks,
        tone: 'success',
      },
      {
        href: '/settings/account/delete',
        title: '계정 삭제',
        description: '삭제한 계정은 복구할 수 없어요.',
        icon: Trash2,
        tone: 'safety',
        action: 'delete-account-dialog',
      },
    ],
  },
];

export const TERMS_SAFETY_ITEMS: SettingsMenuItemType[] = [
  {
    href: '/settings/terms-safety/service-terms',
    title: '서비스 조건',
    description: '이용약관',
    icon: FileText,
    tone: 'safety',
  },
  {
    href: '/settings/terms-safety/privacy-policy',
    title: '수집·보관·삭제',
    description: '개인정보처리방침',
    icon: LockKeyhole,
    tone: 'safety',
  },
  {
    href: '#self-care',
    title: '자기관리 보조',
    description: '의료행위 아님',
    icon: BriefcaseMedical,
    tone: 'safety',
  },
  {
    href: '#crisis-contact',
    title: '전문기관/신뢰 연락처',
    description: '위기 안내',
    icon: Info,
    tone: 'safety',
  },
];

export const HELP_FEEDBACK_ITEMS: HelpFeedbackItem[] = [
  {
    href: '#faq',
    title: '자주 묻는 질문',
    description: 'FAQ',
    icon: SquareLibrary,
    toneClassName: 'bg-[#e3fbf6] text-[#0f8f87]',
  },
  {
    href: '#contact',
    title: '계정/결제/오류',
    description: '문의하기',
    icon: CircleHelp,
    toneClassName: 'bg-[var(--ds-success)] text-[var(--ds-success-ink)]',
  },
  {
    href: '#feedback',
    title: '화면 단위 의견',
    description: '피드백',
    icon: MessageSquare,
    toneClassName: 'bg-[var(--ds-premium)] text-[#6f42c1]',
  },
  {
    href: '#beta',
    title: '인터뷰 신청',
    description: '베타 참여',
    icon: FlaskConical,
    toneClassName: 'bg-[var(--ds-safety)] text-[var(--ds-safety-ink)]',
  },
];
