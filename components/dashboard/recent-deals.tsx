"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

const recentOrders = [
  {
    customer: "Alexander Müller",
    cardType: "Ultra Card",
    price: "€14,499",
    status: "processing",
    date: "2 days ago",
  },
  {
    customer: "Elena Petrova",
    cardType: "Ultra Card",
    price: "€14,499",
    status: "processing",
    date: "3 days ago",
  },
  {
    customer: "Sophie Laurent",
    cardType: "Elite Card",
    price: "€3,599",
    status: "processing",
    date: "4 days ago",
  },
  {
    customer: "Carlos Mendez",
    cardType: "Pro Card",
    price: "€1,449",
    status: "completed",
    date: "5 days ago",
  },
  {
    customer: "James Whitfield",
    cardType: "Pro Card",
    price: "€1,449",
    status: "completed",
    date: "6 days ago",
  },
];

const statusConfig = {
  processing: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Processing",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Completed",
  },
};

export function RecentDeals() {
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
        {recentOrders.map((order, index) => {
          const status = statusConfig[order.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={order.customer}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all duration-200">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.cardType} -- {order.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{order.price}</span>
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.bg, status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
