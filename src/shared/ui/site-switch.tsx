'use client';

import type { ButtonHTMLAttributes } from 'react';

type SiteSwitchProps = {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-checked' | 'children' | 'onChange' | 'onClick' | 'role' | 'type'
>;

export function SiteSwitch({
  checked,
  label,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SiteSwitchProps) {
  const resolvedClassName = [
    'relative h-7 w-12 shrink-0 rounded-full transition-colors',
    'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
    checked
      ? 'bg-[var(--ds-success)]'
      : 'bg-[var(--color-surface-container-high)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={resolvedClassName}
      {...props}
    >
      <span
        className={`absolute top-1 size-5 rounded-full transition-[left,background-color] ${
          checked
            ? 'left-6 bg-[var(--color-primary)]'
            : 'left-1 bg-[var(--color-outline-variant)]'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
