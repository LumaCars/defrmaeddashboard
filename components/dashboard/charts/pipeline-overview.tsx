"use client";

import { cn } from "@/lib/utils";
import { type CustomerOrder, cardPrices } from "@/lib/orders-data";
import { useSettings, formatCurrency } from "@/lib/settings-context";

interface PipelineOverviewProps {
  orders: CustomerOrder[];
}

const stageColors: Record<string, string> = {
  Open: "bg-warning",
  Completed: "bg-success",
};

export function PipelineOverview({ orders }: PipelineOverviewProps) {
  const { settings } = useSettings();
  const open = orders.filter((o) => o.status !== "completed");
  const completed = orders.filter((o) => o.status === "completed");
  const totalRevenue = orders.reduce((s, o) => s + cardPrices[o.cardType], 0);

  const stages = [
    {
      name: "Open",
      count: open.length,
      value: open.reduce((s, o) => s + cardPrices[o.cardType], 0),
    },
    {
      name: "Completed",
      count: completed.length,
      value: completed.reduce((s, o) => s + cardPrices[o.cardType], 0),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">
          Order Status
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Processing vs completed
        </p>
      </div>

      <div className="space-y-5">
        {stages.map((stage, index) => {
          const pct =
            totalRevenue > 0
              ? Math.round((stage.value / totalRevenue) * 100)
              : 0;
          return (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      stageColors[stage.name]
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {stage.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stage.count} orders
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(stage.value, settings.currency)}
                  </span>
                </div>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    stageColors[stage.name]
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-5 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Orders</span>
          <span className="text-lg font-bold text-foreground">
            {orders.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <span className="text-xl font-bold text-foreground">
            {formatCurrency(totalRevenue, settings.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
