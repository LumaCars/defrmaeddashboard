"use client";

import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

const cardBreakdown = [
  { type: "Pro Card", orders: 3, revenue: "€4,347", price: 1449, color: "bg-chart-1" },
  { type: "Elite Card", orders: 2, revenue: "€7,198", price: 3599, color: "bg-accent" },
  { type: "Ultra Card", orders: 3, revenue: "€43,497", price: 14499, color: "bg-warning" },
];

const totalOrders = cardBreakdown.reduce((sum, c) => sum + c.orders, 0);

export function TopPerformers() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Card Type Breakdown</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Orders by card type</p>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {cardBreakdown.map((card, index) => {
          const percentage = Math.round((card.orders / totalOrders) * 100);

          return (
            <div
              key={card.type}
              className="group p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 animate-in fade-in slide-in-from-right-2"
              style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{card.type}</p>
                  <p className="text-xs text-muted-foreground">{card.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{card.revenue}</p>
                  <p className="text-xs text-muted-foreground">{percentage}% of orders</p>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", card.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
