import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type SiteButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

export function SiteButton({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: SiteButtonProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  const isPlainAnchor = isExternal || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:");
  const anchorProps = isExternal
    ? {
        target: "_blank" as const,
        rel: "noreferrer"
      }
    : {};

  const resolvedClassName = ["site-button", `site-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        {...props}
        {...anchorProps}
        className={resolvedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      {...props}
      className={resolvedClassName}
    >
      {children}
    </Link>
  );
}
