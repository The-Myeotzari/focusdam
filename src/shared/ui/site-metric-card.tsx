import type { HTMLAttributes, ReactNode } from "react";

type SiteMetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  variant?: "default" | "primary";
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function SiteMetricCard({
  label,
  value,
  unit,
  variant = "default",
  className,
  ...props
}: SiteMetricCardProps) {
  const resolvedClassName = [
    "site-metric-card",
    variant === "primary" ? "site-metric-card--primary" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section {...props} className={resolvedClassName}>
      <p className="site-metric-card__label">{label}</p>
      <p className="site-metric-card__value">
        {value}
        {unit ? <span className="site-body-md"> {unit}</span> : null}
      </p>
    </section>
  );
}
