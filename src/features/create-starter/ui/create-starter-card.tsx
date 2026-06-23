// 첫 스타터 만들기 버튼

import { SiteButton } from '@/shared/ui';

type Props = {
  className?: string;
};

export function CreateStarterCard({ className }: Props) {
  const resolvedClassName = [
    '!border-0',
    '!bg-[#466d8d]',
    '!text-sm',
    '!font-medium',
    '!shadow-[0_4px_8px_rgba(60,95,124,0.2)]',
    'hover:!bg-[var(--color-primary)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SiteButton href="/starter/new" variant="primary" className={resolvedClassName}>
      첫 스타터 만들기
    </SiteButton>
  );
}
