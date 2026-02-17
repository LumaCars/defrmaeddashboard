"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import { Search, Calendar, LogOut, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/lib/settings-context";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  activeSection: Section;
  onRefresh?: () => Promise<void>;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  deals: "Card Orders",
  customers: "Customers",
  team: "Team Dashboard",
  settings: "Settings",
};

export function Header({ activeSection, onRefresh }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useSettings();
  const { profile } = settings;
  const router = useRouter();

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  const handleRefresh = async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 14 days</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-all duration-200 disabled:opacity-50"
          title="Aktualisieren"
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </button>

        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          {displayName && (
            <span className="text-sm font-medium text-foreground hidden lg:block">
              {displayName}
            </span>
          )}
          <Avatar className="w-9 h-9">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt="Profile" />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-accent/80 to-chart-1 text-xs font-semibold text-accent-foreground">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-destructive/30 text-sm text-destructive hover:bg-destructive/10 transition-all duration-200"
          title="Abmelden"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Abmelden</span>
        </button>
      </div>
    </header>
  );
}
