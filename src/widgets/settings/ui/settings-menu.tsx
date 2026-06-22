// 설정 메뉴 컴포넌트(섹션 기준)

import type { SettingsMenuSection } from '@/widgets/settings';
import { SettingsMenuItem } from '@/widgets/settings';

type Props = {
  sections: SettingsMenuSection[];
};

export function SettingsMenu({ sections }: Props) {
  return (
    <div className="grid gap-8">
      {sections.map((section) => {
        const headingId = `settings-${section.id}`;

        return (
          <section key={section.id} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="mb-2 px-4 text-xs font-semibold text-[var(--color-on-surface-variant)]"
            >
              {section.title}
            </h2>

            <ul className="overflow-hidden rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] p-1 shadow-[var(--shadow-card)]">
              {section.items.map((item) => (
                <SettingsMenuItem key={item.href} {...item} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
