import { Suspense } from "react";
import { FocusNextActionPage } from "@/widgets/focus-empty-page/ui/focus-next-action-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FocusNextActionPage />
    </Suspense>
  );
}
