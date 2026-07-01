'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type SiteToastViewportProps = {
  children: ReactNode;
  className?: string;
};

type SiteToastProps = {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'success' | 'error';
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

function mergeClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(' ');
}

export function SiteToastViewport({ children, className }: SiteToastViewportProps) {
  return (
    <div className={mergeClassNames('site-toast-viewport', className)}>
      {children}
    </div>
  );
}

export function SiteToast({
  open,
  title,
  description,
  duration = 2000,
  onOpenChange,
  variant = 'default',
  className,
  style,
  onAnimationEnd,
  ...props
}: SiteToastProps) {
  if (!open) {
    return null;
  }

  const toastStyle = {
    '--site-toast-duration': `${duration}ms`,
    ...style,
  } as CSSProperties;

  return (
    <div
      role="status"
      aria-live="polite"
      className={mergeClassNames('site-toast', `site-toast--${variant}`, className)}
      style={toastStyle}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event);

        if (event.animationName === 'site-toast-exit') {
          onOpenChange?.(false);
        }
      }}
      {...props}
    >
      {title ? <p className="site-toast-title">{title}</p> : null}
      {description ? <p className="site-toast-description">{description}</p> : null}
    </div>
  );
}
