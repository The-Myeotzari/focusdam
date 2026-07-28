import { OnboardingAccountPage } from "@/widgets/onboarding-account-page";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;

  return <OnboardingAccountPage isLoginMode={mode === "login"} />;
}
