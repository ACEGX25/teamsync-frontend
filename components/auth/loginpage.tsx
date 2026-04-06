// components/auth/loginpage.tsx
"use client";

import { useState } from "react";
import StepLanding from "../auth/stepLanding";
import StepVerify  from "../auth/StepVerify";
import StepSecure  from "../auth/StepSecure";
import StepLogin   from "../auth/StepLogin";

type Step = "landing" | "verify" | "secure" | "login";

export default function LoginPage() {
  const [step, setStep]   = useState<Step>("landing");
  const [email, setEmail] = useState("");

  const handleNext = (email: string, nextStep?: Step) => {
    setEmail(email);
    setStep(nextStep || "verify");
  };

  if (step === "landing")
    return <StepLanding onNext={handleNext} />;

  if (step === "verify")
    return <StepVerify email={email} onNext={() => setStep("secure")} />;

  if (step === "secure")
    return <StepSecure onNext={() => setStep("login")} />;

  return <StepLogin email={email} onBack={() => setStep("landing")} />;
}