"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLanding from "../auth/stepLanding";
import StepVerify  from "../auth/StepVerify";
import StepSecure  from "../auth/StepSecure";
import StepLogin   from "../auth/StepLogin";
import ForgotPassword from "../auth/ForgotPassword";

type Step = "landing" | "verify" | "secure" | "login" | "forgot";

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

  if (step === "forgot")
    return <ForgotPassword onBack={() => setStep("login")} />;

  return (
    <StepLogin
      email={email}
      onNext={() => router.push("/authenticated/dashboard")}
      onBack={() => setStep("landing")}
      onForgot={() => setStep("forgot")}
    />
  );
}