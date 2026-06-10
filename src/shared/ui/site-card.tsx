import type { HTMLAttributes, ReactNode } from "react";

type SiteCardProps = {
  children: ReactNode;
  padded?: boolean;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function SiteCard({
  children,
  padded = true,
  className,
  ...props
}: SiteCardProps) {
  const resolvedClassName = ["site-card", padded ? "site-card--padded" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section {...props} className={resolvedClassName}>
      {children}
    </section>
  );
}
