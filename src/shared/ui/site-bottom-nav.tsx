'use client';

import { CalendarDays, Home, Settings, Timer, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BottomNavItem = {
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
  label: string;
};

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    href: '/',
    icon: Home,
    isActive: (pathname) => pathname === '/home',
    label: '홈',
  },
  {
    href: '/starter/recent',
    icon: CalendarDays,
    isActive: (pathname) => pathname.startsWith('/starter/recent'),
    label: '기록',
  },
  {
    href: '/focus/current?duration=10',
    icon: Timer,
    isActive: (pathname) => pathname.startsWith('/focus/current'),
    label: '타이머',
  },
  {
    href: '/settings',
    icon: Settings,
    isActive: (pathname) => pathname.startsWith('/settings'),
    label: '설정',
  },
];

const BOTTOM_NAV_HIDDEN_SEGMENTS = new Set(['create', 'edit', 'new']);

export function shouldHideBottomNav(pathname: string) {
  if (pathname === '/' || pathname === '/onboarding' || pathname.startsWith('/onboarding/')) {
    return true;
  }

  return pathname
    .split('/')
    .filter(Boolean)
    .some((segment) => BOTTOM_NAV_HIDDEN_SEGMENTS.has(segment));
}

export function SiteBottomNav() {
  const pathname = usePathname();

  if (shouldHideBottomNav(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-1/2 z-[60] w-full max-w-[var(--page-max-width)] -translate-x-1/2 rounded-t-[32px] border-x border-t border-[#c2c7ce33] bg-white/95 shadow-[0_-8px_30px_rgba(60,95,124,0.08)] backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid h-20 grid-cols-4 items-center px-3 sm:px-6">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);

          return (
            <li key={item.href} className="h-full min-w-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-[24px] px-1 text-[12px] font-semibold leading-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#3c5f7c]',
                  active ? 'text-[#3c5f7c]' : 'text-[#5f656c] hover:text-[#3c5f7c]',
                ].join(' ')}
              >
                <span
                  className={[
                    'grid h-8 min-w-12 place-items-center rounded-full transition-colors',
                    active ? 'bg-[#dce2e8]' : 'bg-transparent',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  <Icon size={21} strokeWidth={active ? 2.5 : 2.2} />
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
