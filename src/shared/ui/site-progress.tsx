import type { HTMLAttributes } from "react";

type SiteProgressProps = {
  value: number;
  label?: string;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SiteProgress({ value, label, className, ...props }: SiteProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const resolvedClassName = ["site-progress", className].filter(Boolean).join(" ");

  return (
    <div {...props} className={resolvedClassName}>
      {label ? <p className="site-label-sm">{label}</p> : null}
      <div
        className="site-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
      >
        <div className="site-progress__bar" style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
}
