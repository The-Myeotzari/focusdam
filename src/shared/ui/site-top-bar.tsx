import Link from "next/link";
import React, { type ReactNode } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

type SiteTopBarProps = {
  title: ReactNode;
  action?: ReactNode;
  backHref?: string;
  skipHref?: string;
  skipLabel?: ReactNode;
  variant?: "center" | "leading" | "brand";
  className?: string;
};

export function SiteTopBar({
  title,
  action,
  backHref,
  skipHref,
  skipLabel = "Skip",
  variant = "center",
  className
}: SiteTopBarProps) {
  if (variant === "leading") {
    return (
      <header
        data-site-header="true"
        className={[
          "mx-auto grid h-14 w-full max-w-[var(--page-max-width)] grid-cols-[48px_minmax(0,1fr)_48px] items-center bg-[#faf9fc] px-5 py-4",
          className
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <HeaderBackSlot href={backHref} />
        <h1 className="m-0 min-w-0 truncate text-left text-[16px] font-medium leading-6 text-[#3c5f7c]">
          {title}
        </h1>
        <HeaderActionSlot href={skipHref} action={action}>
          {skipLabel}
        </HeaderActionSlot>
      </header>
    );
  }

  if (variant === "brand") {
    return (
      <header
        data-site-header="true"
        className={[
          "mx-auto grid h-[61px] w-full max-w-[var(--page-max-width)] grid-cols-[48px_minmax(0,1fr)_48px] items-center bg-[#faf9fc] px-5 py-2",
          className
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <HeaderBackSlot href={backHref} />
        <h1 className="m-0 min-w-0 truncate text-center font-['Noto_Sans_KR',sans-serif] text-[32px] font-bold leading-[45px] text-[#3c5f7c]">
          {title}
        </h1>
        <span className="flex h-6 w-4 items-center justify-end text-[#42474d]" aria-hidden="true">
          <MoreVertical size={16} strokeWidth={2.2} />
        </span>
      </header>
    );
  }

  return (
    <header
      data-site-header="true"
      className={[
        "relative mx-auto grid h-14 w-full max-w-[var(--page-max-width)] grid-cols-[48px_minmax(0,1fr)_48px] items-center bg-[#faf9fc] px-5 py-4",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <HeaderBackSlot href={backHref} />
      <h1 className="m-0 min-w-0 truncate text-center text-[16px] font-medium leading-6 text-[#3c5f7c]">
        {title}
      </h1>
      <HeaderActionSlot href={skipHref} action={action}>
        {skipLabel}
      </HeaderActionSlot>
    </header>
  );
}

function HeaderBackSlot({ href }: { href?: string }) {
  if (!href) {
    return <span className="h-6 w-12" aria-hidden="true" />;
  }

  return (
    <Link href={href} className="flex h-6 w-12 shrink-0 items-center justify-start text-[#3c5f7c]" aria-label="이전 화면으로 돌아가기">
      <ArrowLeft size={16} strokeWidth={2} />
    </Link>
  );
}

function HeaderActionSlot({ href, action, children }: { href?: string; action?: ReactNode; children: ReactNode }) {
  if (action) {
    return <span className="flex h-8 w-12 items-center justify-end">{action}</span>;
  }

  if (!href) {
    return <span className="h-6 w-12" aria-hidden="true" />;
  }

  return (
    <Link href={href} className="relative -top-px flex h-6 w-12 shrink-0 items-center justify-end font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#42474d]">
      {children}
    </Link>
  );
}
