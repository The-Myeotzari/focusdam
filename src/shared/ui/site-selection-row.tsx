import type { HTMLAttributes, ReactNode } from "react";

type SiteSelectionRowProps = {
  children: ReactNode;
  type?: "radio" | "checkbox" | "toggle";
  checked?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SiteSelectionRow({
  children,
  type = "radio",
  checked = true,
  className,
  ...props
}: SiteSelectionRowProps) {
  const resolvedClassName = [
    "site-selection-row",
    `site-selection-row--${type}`,
    checked ? "site-selection-row--checked" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={resolvedClassName}>
      <span className="site-selection-row__content">
        {type === "toggle" ? null : (
          <span className="site-selection-row__control" aria-hidden="true">
            {checked && type === "checkbox" ? "✓" : null}
          </span>
        )}
        <span>{children}</span>
      </span>
      {type === "toggle" ? <span className="site-selection-row__toggle" aria-hidden="true" /> : null}
    </div>
  );
}
