"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/sign-in/canvas-reveal-effect";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setIsLoading(false);
      if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else {
        setError(authError.message);
      }
      return;
    }

    // Success - redirect to dashboard with full page reload
    window.location.href = "/";
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-sm px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-medium block text-left pl-4">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-medium block text-left pl-4">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className={`w-full rounded-full font-semibold py-3 transition-all duration-300 ${
                    !isLoading && email && password
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 cursor-pointer"
                      : "bg-white/10 text-white/50 cursor-not-allowed"
                  }`}
                  whileHover={!isLoading && email && password ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && email && password ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-white/30 pt-4">
                Only authorized admin accounts can access this dashboard.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
