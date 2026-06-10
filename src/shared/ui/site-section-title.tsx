import type { ReactNode } from "react";

type SiteSectionTitleProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
};

export function SiteSectionTitle({ title, description, eyebrow }: SiteSectionTitleProps) {
  return (
    <header className="site-stack" style={{ gap: 8 }}>
      {eyebrow ? <p className="site-eyebrow">{eyebrow}</p> : null}
      <h2 className="site-title-lg">{title}</h2>
      {description ? <p className="site-body-md">{description}</p> : null}
    </header>
  );
}
