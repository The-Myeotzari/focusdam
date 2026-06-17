import type { HTMLAttributes, ReactNode } from "react";

type SiteStateCardProps = {
  label: ReactNode;
  description?: ReactNode;
  active?: boolean;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function SiteStateCard({
  label,
  description,
  active = false,
  className,
  ...props
}: SiteStateCardProps) {
  const resolvedClassName = [
    "site-state-card",
    active ? "site-state-card--active" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section {...props} className={resolvedClassName}>
      <div>
        <div className="site-state-card__pill">{label}</div>
        {description ? <p className="site-label-sm" style={{ marginTop: 10 }}>{description}</p> : null}
      </div>
    </section>
  );
}
