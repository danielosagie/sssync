import { Button } from "./ui/button";

export function OnboardingButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="bg-black text-white p-4"
      onClick={onClick}
    >
      Start Onboarding!
    </Button>
  );
} 