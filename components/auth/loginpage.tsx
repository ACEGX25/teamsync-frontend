"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLanding from "../auth/stepLanding";
import StepVerify  from "../auth/StepVerify";
import StepSecure  from "../auth/StepSecure";
import StepLogin   from "../auth/StepLogin";

type Step = "landing" | "verify" | "secure" | "login";

export default function LoginPage() {
  const router = useRouter();
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
    return <StepSecure email={email} onNext={() => setStep("login")} />;

  return <StepLogin email={email} onNext={() => router.push("/authenticated/dashboard")} onBack={() => setStep("landing")} />;
}