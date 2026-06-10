import type { InputHTMLAttributes } from "react";

type SiteInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SiteInput({ className, ...props }: SiteInputProps) {
  const resolvedClassName = ["site-input", className].filter(Boolean).join(" ");

  return <input {...props} className={resolvedClassName} />;
}
