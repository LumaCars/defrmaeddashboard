"use client";

import { Wrench, Clock } from "lucide-react";

export function TeamSection() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
            <Wrench className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
            <Clock className="w-7 h-7 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Team Dashboard</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          This section is currently under maintenance.
        </p>
      </div>
    </div>
  );
}
