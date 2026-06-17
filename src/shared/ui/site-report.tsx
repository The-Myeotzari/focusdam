import type { HTMLAttributes, ReactNode } from "react";

type SiteReportBoardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

type SiteReportRowProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SiteReportBoard({ children, className, ...props }: SiteReportBoardProps) {
  const resolvedClassName = ["site-report-board", className].filter(Boolean).join(" ");

  return (
    <section {...props} className={resolvedClassName}>
      {children}
    </section>
  );
}

export function SiteReportRow({
  icon,
  title,
  description,
  value,
  className,
  ...props
}: SiteReportRowProps) {
  const resolvedClassName = ["site-report-row", className].filter(Boolean).join(" ");

  return (
    <div {...props} className={resolvedClassName}>
      <span className="site-report-row__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="site-report-row__title">{title}</p>
        {description ? <p className="site-report-row__description">{description}</p> : null}
      </div>
      {value ? <p className="site-report-row__value">{value}</p> : null}
    </div>
  );
}
