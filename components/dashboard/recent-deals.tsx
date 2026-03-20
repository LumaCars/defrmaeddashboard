"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { type CustomerOrder } from "@/lib/orders-data";
import { useSettings, formatCurrency } from "@/lib/settings-context";

function isCompleted(status: string) {
  return status.toLowerCase() === "completed";
}

function statusDisplay(status: string) {
  if (isCompleted(status)) {
    return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Completed" };
  }
  return { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: status.charAt(0).toUpperCase() + status.slice(1) };
}

interface RecentDealsProps {
  orders: CustomerOrder[];
}

export function RecentDeals({ orders }: RecentDealsProps) {
  const { settings } = useSettings();
  const sorted = [...orders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
  const recent = sorted.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Card Orders</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Latest activity</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors group">
          View all
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="space-y-3">
        {recent.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2">
            <Clock className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground/60">Recent orders will appear here</p>
          </div>
        )}
        {recent.map((order, index) => {
          const done = isCompleted(order.status);
          const st = statusDisplay(order.status);
          const StatusIcon = st.icon;
          const daysAgo = Math.max(
            1,
            Math.floor(
              (Date.now() - new Date(order.orderDate).getTime()) / (1000 * 60 * 60 * 24)
            )
          );

          return (
            <div
              key={order.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2",
                done ? "opacity-50" : "hover:bg-secondary/50"
              )}
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    done
                      ? "bg-muted text-muted-foreground"
                      : "bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                  )}
                >
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className={cn("text-sm font-medium", done ? "text-muted-foreground line-through" : "text-foreground")}>
                    {order.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.cardType} Card -- {daysAgo}d ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={cn("text-sm font-semibold", done ? "text-muted-foreground" : "text-foreground")}>
                  {formatCurrency(order.priceCents / 100, settings.currency)}
                </span>
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  done ? "bg-muted text-muted-foreground" : `${st.bg} ${st.color}`
                )}>
                  <StatusIcon className="w-3 h-3" />
                  {st.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
