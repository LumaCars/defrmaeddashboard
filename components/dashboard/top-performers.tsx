"use client";

import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { type CustomerOrder, type CardType } from "@/lib/orders-data";
import { useSettings, formatCurrency } from "@/lib/settings-context";

interface TopPerformersProps {
  orders: CustomerOrder[];
}

const cardColors: Record<string, string> = {
  Pro: "bg-chart-1",
  Elite: "bg-accent",
  Ultra: "bg-warning",
};

export function TopPerformers({ orders }: TopPerformersProps) {
  const { settings } = useSettings();
  const totalOrders = orders.length;

  const breakdown = (["Pro", "Elite", "Ultra"] as CardType[]).map((type) => {
    const typeOrders = orders.filter((o) => o.cardType === type);
    const count = typeOrders.length;
    const revenue = typeOrders.reduce((s, o) => s + (o.priceCents / 100), 0);
    return {
      type: `${type} Card`,
      orders: count,
      revenue: formatCurrency(revenue, settings.currency),
      color: cardColors[type],
      percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
    };
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Card Type Breakdown
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Orders by card type
          </p>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {totalOrders === 0 && (
          <div className="py-12 flex flex-col items-center gap-2">
            <CreditCard className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground/60">Card type breakdown will appear here</p>
          </div>
        )}
        {breakdown.map((card, index) => (
          <div
            key={card.type}
            className="group p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 animate-in fade-in slide-in-from-right-2"
            style={{
              animationDelay: `${(index + 4) * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {card.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.orders} orders
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {card.revenue}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.percentage}% of orders
                </p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  card.color
                )}
                style={{ width: `${card.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
