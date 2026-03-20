"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";
import { type CustomerOrder, type CardType } from "@/lib/orders-data";
import { useSettings, formatCurrency } from "@/lib/settings-context";

const cardColors: Record<CardType, string[]> = {
  Pro: ["Red", "Rainbow", "Blue", "Pink", "Stainless Steel"],
  Elite: ["Matte Black", "Glossy Black", "Brushed Black", "White"],
  Ultra: ["Matte Black", "Glossy Black", "Brushed Black", "White", "24K Gold Edition"],
};

function isCompleted(status: string) {
  return status.toLowerCase() === "completed";
}

interface DealsSectionProps {
  orders: CustomerOrder[];
  loading?: boolean;
}

export function DealsSection({ orders, loading }: DealsSectionProps) {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCardType, setFilterCardType] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("orderDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const availableColors =
    filterCardType === "all"
      ? [...new Set(Object.values(cardColors).flat())]
      : cardColors[filterCardType as CardType] || [];

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.cardType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterCardType === "all" || order.cardType === filterCardType;
      const matchesColor = filterColor === "all" || order.cardColor === filterColor;
      const matchesPayment = filterPayment === "all" || order.paymentMethod === filterPayment;
      return matchesSearch && matchesType && matchesColor && matchesPayment;
    })
    .sort((a, b) => {
      if (sortField === "orderDate") {
        return sortDir === "desc"
          ? new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          : new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      }
      if (sortField === "customerName") {
        return sortDir === "asc"
          ? a.customerName.localeCompare(b.customerName)
          : b.customerName.localeCompare(a.customerName);
      }
      if (sortField === "price") {
        return sortDir === "desc"
          ? b.priceCents - a.priceCents
          : a.priceCents - b.priceCents;
      }
      return 0;
    });

  const totalRevenue = orders.reduce((sum, order) => sum + (order.priceCents / 100), 0);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          View and manage all card orders -- Total Revenue: {formatCurrency(totalRevenue, settings.currency)}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customer or card type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <select
              value={filterCardType}
              onChange={(e) => { setFilterCardType(e.target.value); setFilterColor("all"); }}
              className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            >
              <option value="all">All Card Types</option>
              <option value="Pro">Pro Card</option>
              <option value="Elite">Elite Card</option>
              <option value="Ultra">Ultra Card</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            >
              <option value="all">All Colors</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            >
              <option value="all">All Payments</option>
              <option value="Crypto">Crypto</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => handleSort("customerName")}>
                    Customer Name <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Color</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engraved Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => handleSort("price")}>
                    Price <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                      <p className="text-muted-foreground text-sm">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">No card orders yet</p>
                      <p className="text-muted-foreground/60 text-xs">Orders will appear here once placed</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredOrders.map((order, index) => {
                const cardTypeBg: Record<CardType, string> = {
                  Pro: "bg-chart-1/10 text-chart-1",
                  Elite: "bg-accent/10 text-accent",
                  Ultra: "bg-warning/10 text-warning",
                };
                const done = isCompleted(order.status);
                const statusColor = done ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
                const statusLabel = done ? "Completed" : order.status.charAt(0).toUpperCase() + order.status.slice(1);

                return (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-150 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                          {order.customerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn("px-2 py-1 rounded-md text-xs font-medium", cardTypeBg[order.cardType])}>
                        {order.cardType} Card
                      </span>
                    </td>
                    <td className="py-4 px-4"><span className="text-sm text-foreground">{order.cardColor}</span></td>
                    <td className="py-4 px-4"><span className="text-sm text-muted-foreground max-w-[200px] truncate block">{order.address}</span></td>
                    <td className="py-4 px-4">
                      {order.wantsEngraving ? (
                        <div>
                          <span className="text-xs font-medium text-success">Yes</span>
                          {order.engravedName && <span className="text-xs text-muted-foreground ml-1.5">({order.engravedName})</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-foreground">{order.paymentMethod}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.priceCents / 100, settings.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn("inline-flex items-center px-2 py-1 rounded-md text-xs font-medium", statusColor)}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">Showing {filteredOrders.length} of {orders.length} orders</span>
          <span className="text-sm font-medium text-foreground">
            Filtered Revenue: {formatCurrency(filteredOrders.reduce((sum, o) => sum + (o.priceCents / 100), 0), settings.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
