"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Feb 3", revenue: 1449, orders: 1 },
  { day: "Feb 4", revenue: 3599, orders: 1 },
  { day: "Feb 5", revenue: 14499, orders: 1 },
  { day: "Feb 6", revenue: 1449, orders: 1 },
  { day: "Feb 7", revenue: 1449, orders: 1 },
  { day: "Feb 8", revenue: 3599, orders: 1 },
  { day: "Feb 9", revenue: 14499, orders: 1 },
  { day: "Feb 10", revenue: 14499, orders: 1 },
];

const cumulativeData = data.reduce<{ day: string; revenue: number; cumulative: number }[]>(
  (acc, item) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
    acc.push({ day: item.day, revenue: item.revenue, cumulative: prev + item.revenue });
    return acc;
  },
  []
);

function formatEuro(value: number): string {
  if (value >= 1000) {
    return `\u20AC${(value / 1000).toFixed(1)}K`;
  }
  return `\u20AC${value}`;
}

export function RevenueChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Card Orders Revenue</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Cumulative revenue -- Last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Cumulative</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Per Order</span>
          </div>
        </div>
      </div>

      <div className={`h-[280px] transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 220)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.7 0.18 220)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="perOrderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              tickFormatter={(value) => formatEuro(value)}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.005 260)",
                border: "1px solid oklch(0.22 0.005 260)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "oklch(0.95 0 0)", fontWeight: 600 }}
              itemStyle={{ color: "oklch(0.65 0 0)" }}
              formatter={(value: number, name: string) => [
                formatEuro(value),
                name === "cumulative" ? "Cumulative" : "Per Order",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="oklch(0.7 0.18 145)"
              strokeWidth={2}
              fill="url(#perOrderGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="oklch(0.7 0.18 220)"
              strokeWidth={2}
              fill="url(#cumulativeGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
