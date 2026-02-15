"use client";

import { useState, useEffect } from "react";

const cardTypes = [
  { name: "Pro Card", orders: 3, revenue: 4347, color: "bg-chart-1" },
  { name: "Elite Card", orders: 2, revenue: 7198, color: "bg-accent" },
  { name: "Ultra Card", orders: 3, revenue: 43497, color: "bg-warning" },
];

const totalOrders = cardTypes.reduce((sum, c) => sum + c.orders, 0);
const totalRevenue = cardTypes.reduce((sum, c) => sum + c.revenue, 0);

function formatEuro(value: number): string {
  if (value >= 1000) {
    return `\u20AC${(value / 1000).toFixed(1)}K`;
  }
  return `\u20AC${value}`;
}

export function PipelineOverview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Card Type Distribution</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Orders by card type</p>
      </div>

      <div className="space-y-5">
        {cardTypes.map((card, index) => {
          const percentage = Math.round((card.orders / totalOrders) * 100);

          return (
            <div key={card.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{card.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{card.orders} orders</span>
                  <span className="text-sm font-semibold text-foreground">{formatEuro(card.revenue)}</span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${card.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: isLoaded ? `${percentage}%` : "0%",
                    transitionDelay: `${index * 150}ms`,
                  }}
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
          <span className="text-lg font-bold text-foreground">{totalOrders}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <span className="text-xl font-bold text-foreground">{formatEuro(totalRevenue)}</span>
        </div>
      </div>
    </div>
  );
}
