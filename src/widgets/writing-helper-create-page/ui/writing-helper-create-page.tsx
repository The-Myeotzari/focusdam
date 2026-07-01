import { WritingHelperPlayground } from '@/features/writing-helper';
import { SiteTopBar } from '@/shared/ui';

export function WritingHelperCreatePage() {
  return (
    <>
      <SiteTopBar title="문장 작성" backHref="/writing-helper" skipHref="/writing-helper" />
      <WritingHelperPlayground />
    </>
  );
}
