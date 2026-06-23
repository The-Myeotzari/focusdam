import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

type SiteTopBarProps = {
  title: ReactNode;
  backHref?: string;
  skipHref?: string;
  skipLabel?: ReactNode;
  variant?: "center" | "leading" | "brand";
  className?: string;
};

export function SiteTopBar({
  title,
  backHref = "/",
  skipHref = "/",
  skipLabel = "Skip",
  variant = "center",
  className
}: SiteTopBarProps) {
  if (variant === "leading") {
    return (
      <header className={["flex h-14 w-full items-center justify-between bg-[#faf9fc] px-5 py-4", className].filter(Boolean).join(" ")}>
        <div className="flex h-6 w-[91px] items-center gap-4">
          <Link href={backHref} className="flex h-6 w-4 shrink-0 items-center justify-center text-[#3c5f7c]" aria-label="이전 화면으로 돌아가기">
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>
          <h1 className="relative -top-px m-0 flex h-6 w-[59px] items-center whitespace-nowrap text-[16px] font-medium leading-6 text-[#3c5f7c]">
            {title}
          </h1>
        </div>
        <Link href={skipHref} className="relative -top-px flex h-6 w-[27.31px] shrink-0 items-center justify-center font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#42474d]">
          {skipLabel}
        </Link>
      </header>
    );
  }

  if (variant === "brand") {
    return (
      <header className={["flex h-[61px] w-full max-w-[600px] items-center justify-between bg-[#faf9fc] px-5 py-2", className].filter(Boolean).join(" ")}>
        <BackLink href={backHref} />
        <h1 className="relative -top-px m-0 flex h-[45px] w-[117.77px] items-center justify-center font-['Noto_Sans_KR',sans-serif] text-[32px] font-bold leading-[45px] text-[#3c5f7c]">
          {title}
        </h1>
        <span className="flex h-6 w-4 items-center justify-end text-[#42474d]" aria-hidden="true">
          <MoreVertical size={16} strokeWidth={2.2} />
        </span>
      </header>
    );
  }

  return (
    <header className={["relative flex h-14 w-full items-center justify-between bg-[#faf9fc] px-5 py-4", className].filter(Boolean).join(" ")}>
      <BackLink href={backHref} />
      <h1 className="relative  m-0 flex h-6 w-[55px] items-center justify-center whitespace-nowrap text-[16px] font-medium leading-6 text-[#3c5f7c]">
        {title}
      </h1>
      <SkipLink href={skipHref}>{skipLabel}</SkipLink>
    </header>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="flex h-6 w-12 shrink-0 items-center justify-start text-[#3c5f7c]" aria-label="이전 화면으로 돌아가기">
      <ArrowLeft size={16} strokeWidth={2} />
    </Link>
  );
}

function SkipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="relative -top-px flex h-6 w-12 shrink-0 items-center justify-end font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#42474d]">
      {children}
    </Link>
  );
}
