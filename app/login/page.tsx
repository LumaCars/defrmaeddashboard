"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "@/components/sign-in/canvas-reveal-effect";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "passcode" | "success">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email) {
      setStep("passcode");
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const newCode = [...passcode];
    newCode[index] = value;
    setPasscode(newCode);
    setError("");

    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setPasscode(newCode);
      codeInputRefs.current[5]?.focus();
    }
  };

  const handleLogin = async () => {
    const code = passcode.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: code,
    });

    if (authError) {
      setIsLoading(false);
      setError("Email or passcode is incorrect.");
      return;
    }

    // Success animation
    setReverseCanvasVisible(true);
    setTimeout(() => {
      setInitialCanvasVisible(false);
    }, 50);
    setTimeout(() => {
      setStep("success");
      setIsLoading(false);
    }, 2000);
  };

  const handleBackClick = () => {
    setStep("email");
    setPasscode(["", "", "", "", "", ""]);
    setError("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const isPasscodeComplete = passcode.every((d) => d !== "");

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [234, 179, 8],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[
                [234, 179, 8],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-sm px-6">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  {/* Logo */}
                  <div className="flex justify-center mb-2">
                    <img
                      src="/images/borderless-logo.svg"
                      alt="Borderless Banking"
                      className="h-12 w-auto object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-white text-balance">
                      Admin Login
                    </h1>
                    <p className="text-[1.1rem] text-white/50 font-light">
                      Sign in to your dashboard
                    </p>
                  </div>

                  <div className="space-y-4">
                    <form onSubmit={handleEmailSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider font-medium block text-left pl-4">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center"
                            required
                          />
                          <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden"
                          >
                            <span className="relative w-full h-full block overflow-hidden">
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                                {"->"}
                              </span>
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                                {"->"}
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <p className="text-xs text-white/30 pt-6">
                    Only authorized admin accounts can access this dashboard.
                  </p>
                </motion.div>
              ) : step === "passcode" ? (
                <motion.div
                  key="passcode-step"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <img
                      src="/images/borderless-logo.svg"
                      alt="Borderless Banking"
                      className="h-12 w-auto object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-white text-balance">
                      Enter Passcode
                    </h1>
                    <p className="text-[1.1rem] text-white/50 font-light">
                      Enter your 6-digit passcode.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-medium block text-left pl-4">
                      Passcode (6 digits)
                    </label>
                    <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                      <div className="flex items-center justify-center" onPaste={handlePaste}>
                        {passcode.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <div className="relative">
                              <input
                                ref={(el) => {
                                  codeInputRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleCodeChange(i, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                                style={{ caretColor: "transparent" }}
                              />
                              {!digit && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                  <span className="text-xl text-white/30">
                                    0
                                  </span>
                                </div>
                              )}
                            </div>
                            {i < 5 && (
                              <span className="text-white/20 text-xl">|</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex w-full gap-3">
                    <motion.button
                      onClick={handleBackClick}
                      className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      disabled={isLoading}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleLogin}
                      disabled={!isPasscodeComplete || isLoading}
                      className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                        isPasscodeComplete && !isLoading
                          ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                          : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                      }`}
                      whileHover={isPasscodeComplete && !isLoading ? { scale: 1.02 } : {}}
                      whileTap={isPasscodeComplete && !isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        "Log in"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.3,
                  }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <img
                      src="/images/borderless-logo.svg"
                      alt="Borderless Banking"
                      className="h-12 w-auto object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-white text-balance">
                      {"You're in!"}
                    </h1>
                    <p className="text-[1.1rem] text-white/50 font-light">
                      Welcome to your dashboard
                    </p>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="py-8"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => {
                      router.refresh();
                      router.push("/");
                    }}
                    className="w-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-semibold py-3 hover:from-amber-500 hover:to-amber-600 transition-colors cursor-pointer"
                  >
                    Continue to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
