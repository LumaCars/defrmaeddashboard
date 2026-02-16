"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import { Bell, Search, Calendar } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/lib/settings-context";

interface HeaderProps {
  activeSection: Section;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  deals: "Card Orders",
  customers: "Customers",
  team: "Team Dashboard",
  settings: "Settings",
};

export function Header({ activeSection }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { settings } = useSettings();
  const { profile } = settings;

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

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

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          {displayName && (
            <span className="text-sm font-medium text-foreground hidden lg:block">
              {displayName}
            </span>
          )}
          <Avatar className="w-9 h-9 ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200 cursor-pointer">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt="Profile" />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-accent/80 to-chart-1 text-xs font-semibold text-accent-foreground">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
