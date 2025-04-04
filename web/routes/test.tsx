import { useContext, useState, useEffect } from 'react';
import { ShopContext, AuthContext } from '../providers';
//import { OnboardingButton, OnboardingDialog } from "../components/OnboardingDialog";
import { OnboardingFlow } from "../components/OnboardingFlow";
import { Button } from '../components/ui/button';
import { secondsInDay } from 'date-fns/constants';
import { OnboardingButton } from "../components/OnboardingButton";


export default function Test() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  

  // Debugging: Log the user object
  useEffect(() => {
    console.log("User object:", user);
  }, [user]);

  // Debugging: Log isOpen changes
  useEffect(() => {
    console.log("isOpen changed to:", isOpen);
  }, [isOpen]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center h-screen">
      {/*
      <OnboardingButton
        onClick={() => {
          console.log("Button clicked, setting isOpen to true");
          setIsOpen(true);
        }}
      />
      <OnboardingDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onComplete={() => {
          console.log("Onboarding complete");
          setIsOpen(false);
        }}
      />
      */}

      <Button className="mt-4" onClick={() => setIsOnboardingOpen(true)}>
        Start Onboarding
      </Button>

      <OnboardingButton onClick={() => setIsOnboardingOpen(true)} />

      <Button className="mt-4" variant="outline" onClick={() => setIsOpen(true)}>Start Onboarding</Button>
      <OnboardingFlow 
        isOnboardingOpen={isOnboardingOpen}
        setIsOnboardingOpen={setIsOnboardingOpen}
      />
    </div>
  );
}   