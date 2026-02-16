"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Currency = "EUR" | "USD" | "AED";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
}

export interface AppSettings {
  currency: Currency;
  darkMode: boolean;
  profile: UserProfile;
}

interface SettingsContextValue {
  settings: AppSettings;
  setCurrency: (c: Currency) => void;
  setDarkMode: (on: boolean) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
}

const defaultSettings: AppSettings = {
  currency: "EUR",
  darkMode: true,
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: null,
    initials: "BB",
  },
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const setCurrency = useCallback((currency: Currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  }, []);

  const setDarkMode = useCallback((darkMode: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode }));
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setSettings((prev) => {
      const updated = { ...prev.profile, ...partial };
      // Auto-compute initials
      const first = updated.firstName?.charAt(0) || "";
      const last = updated.lastName?.charAt(0) || "";
      updated.initials = (first + last).toUpperCase() || "BB";
      return { ...prev, profile: updated };
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setCurrency, setDarkMode, updateProfile }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

// Currency formatting utilities
const currencyConfig: Record<Currency, { locale: string; code: string; symbol: string }> = {
  EUR: { locale: "de-DE", code: "EUR", symbol: "\u20AC" },
  USD: { locale: "en-US", code: "USD", symbol: "$" },
  AED: { locale: "ar-AE", code: "AED", symbol: "AED" },
};

export function formatCurrency(value: number, currency: Currency): string {
  const cfg = currencyConfig[currency];
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyCompact(value: number, currency: Currency): string {
  const cfg = currencyConfig[currency];
  if (value >= 1000000) return `${cfg.symbol}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${cfg.symbol}${(value / 1000).toFixed(1)}K`;
  return formatCurrency(value, currency);
}
