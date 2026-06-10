import type { HTMLAttributes, ReactNode } from "react";

type SiteBadgeProps = {
  children: ReactNode;
  tone?: "primary" | "success" | "caution" | "premium" | "safety";
  className?: string;
} & HTMLAttributes<HTMLSpanElement>;

export function SiteBadge({
  children,
  tone = "primary",
  className,
  ...props
}: SiteBadgeProps) {
  const resolvedClassName = ["site-badge", `site-badge--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={resolvedClassName}>
      {children}
    </span>
  );
}
