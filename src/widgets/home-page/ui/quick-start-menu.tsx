import {
  Banknote,
  ChartNoAxesCombined,
  Heart,
  MessageSquare,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

type QuickStartItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  href?: string;
  fullWidth?: boolean;
};

const QUICK_START_ITEMS: QuickStartItem[] = [
  {
    title: 'Action',
    description: '실행',
    icon: Zap,
    iconClassName: 'bg-[#eeeae7] text-[#8a6221]',
    href: '/starter/new',
  },
  {
    title: 'Emotion',
    description: '감정',
    icon: Heart,
    iconClassName: 'bg-[#ffe5ef] text-[#e91668]',
  },
  {
    title: 'Spend',
    description: '소비',
    icon: Banknote,
    iconClassName: 'bg-[#e5f5e9] text-[#248337]',
    href: '/payment-third-review',
  },
  {
    title: 'Talk',
    description: '대화',
    icon: MessageSquare,
    iconClassName: 'bg-[#e0f1ff] text-[#0a61b9]',
  },
  {
    title: 'Weekly Report',
    description: '주간 리포트',
    icon: ChartNoAxesCombined,
    iconClassName: 'bg-[#eee9ff] text-[#645785]',
    href: '/review',
    fullWidth: true,
  },
];

export function QuickStartMenu() {
  return (
    <section aria-labelledby="quick-start-title">
      <h2
        id="quick-start-title"
        className="m-0 text-lg font-medium leading-[1.5] text-[var(--color-on-surface)]"
      >
        Quick Start
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {QUICK_START_ITEMS.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span
                className={`grid size-10 place-items-center rounded-full ${item.iconClassName}`}
                aria-hidden="true"
              >
                <Icon size={24} strokeWidth={1.9} />
              </span>

              <span className="mt-3.5 text-xs font-semibold leading-[1.4] text-[var(--color-on-surface-variant)]">
                {item.title}
              </span>

              <span className="mt-0.5 text-base leading-[1.5] text-[var(--color-on-surface)]">
                {item.description}
              </span>
            </>
          );

          const cardClassName =
            `flex min-h-[118px] flex-col items-start rounded-[32px] bg-[#f4f3f6e6] p-5 text-left ${item.fullWidth ? 'col-span-2' : ''}`;

          if (item.href) {
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`${cardClassName} transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-container)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#3c5f7c40]`}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={item.title}
              aria-disabled="true"
              className={cardClassName}
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
