// 설정 홈 화면 페이지

import { SETTINGS_MENU_SECTIONS, SettingsMenuItem } from '@/widgets/settings';

export function SettingsHomePage() {
  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      <div className="grid gap-8">
        {SETTINGS_MENU_SECTIONS.map((section) => (
          <section key={section.title} aria-labelledby={`settings-${section.title}`}>
            <h2
              id={`settings-${section.title}`}
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
        ))}
      </div>
    </main>
  );
}
