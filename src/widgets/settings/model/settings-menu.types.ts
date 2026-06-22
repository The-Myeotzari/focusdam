import type { LucideIcon } from 'lucide-react';

// 설정 메뉴 아이템 타입과 섹션 타입 정의
export type SettingsMenuItemType = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'primary' | 'success' | 'caution' | 'premium' | 'safety';
};

// 설정 메뉴 섹션 타입 정의
export type SettingsMenuSection = {
  id: string;
  title: string;
  items: SettingsMenuItemType[];
};
