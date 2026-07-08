import { Suspense } from "react";
import { FocusCurrentPage } from "@/widgets/focus-empty-page/ui/focus-current-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FocusCurrentPage />
    </Suspense>
  );
}
