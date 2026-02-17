"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ChevronDown,
  Users,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Check,
  Undo2,
  ChevronRight,
} from "lucide-react";
import {
  type CustomerOrder,
  type CardType,
  cardPrices,
} from "@/lib/orders-data";
import { useSettings, formatCurrencyCompact } from "@/lib/settings-context";

interface CustomersSectionProps {
  orders: CustomerOrder[];
  onMarkCompleted: (email: string) => void;
  onUndoCompleted: (email: string) => void;
  loading?: boolean;
}

function isCompleted(status: string) {
  return status.toLowerCase() === "completed";
}

function buildCustomerMap(orders: CustomerOrder[]) {
  const customerMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      totalOrders: number;
      lastOrderDate: string;
      latestCardType: CardType;
      latestCardColor: string;
      paymentMethod: string;
      latestStatus: string;
    }
  >();

  orders.forEach((order) => {
    const existing = customerMap.get(order.email);
    if (
      !existing ||
      new Date(order.orderDate) > new Date(existing.lastOrderDate)
    ) {
      const totalOrders = orders.filter((o) => o.email === order.email).length;
      customerMap.set(order.email, {
        name: order.customerName,
        email: order.email,
        phone: order.phone,
        totalOrders,
        lastOrderDate: order.orderDate,
        latestCardType: order.cardType,
        latestCardColor: order.cardColor,
        paymentMethod: order.paymentMethod,
        latestStatus: order.status,
      });
    }
  });

  return Array.from(customerMap.values());
}

export function CustomersSection({
  orders,
  onMarkCompleted,
  onUndoCompleted,
  loading,
}: CustomersSectionProps) {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCardType, setFilterCardType] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [completedExpanded, setCompletedExpanded] = useState(true);

  const customers = buildCustomerMap(orders);

  // KPIs
  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + cardPrices[o.cardType],
    0
  );
  const activeCardOrders = orders.filter(
    (o) => !isCompleted(o.status)
  ).length;
  const completedCardOrders = orders.filter(
    (o) => isCompleted(o.status)
  ).length;

  const cardTypeCounts: Record<CardType, number> = {
    Pro: 0,
    Elite: 0,
    Ultra: 0,
  };
  orders.forEach((o) => cardTypeCounts[o.cardType]++);
  const topCardEntry = (
    Object.entries(cardTypeCounts) as [CardType, number][]
  ).sort((a, b) => b[1] - a[1])[0];
  const topCardType = topCardEntry ? topCardEntry[0] : "Pro";
  const topCardCount = topCardEntry ? topCardEntry[1] : 0;

  // Split into active and completed
  const activeCustomers = customers.filter(
    (c) => !isCompleted(c.latestStatus)
  );
  const completedCustomers = customers.filter(
    (c) => isCompleted(c.latestStatus)
  );

  // Apply filters
  const applyFilters = (
    list: typeof customers
  ) =>
    list.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterCardType === "all" || c.latestCardType === filterCardType;
      const matchesPayment =
        filterPayment === "all" || c.paymentMethod === filterPayment;
      return matchesSearch && matchesType && matchesPayment;
    });

  const filteredActive = applyFilters(activeCustomers);
  const filteredCompleted = applyFilters(completedCustomers);

  const cardTypeBg: Record<CardType, string> = {
    Pro: "bg-chart-1/10 text-chart-1",
    Elite: "bg-accent/10 text-accent",
    Ultra: "bg-warning/10 text-warning",
  };

  const renderRow = (
    customer: (typeof customers)[0],
    index: number,
    isCompletedRow: boolean
  ) => (
    <tr
      key={customer.email}
      className={cn(
        "border-b border-border last:border-0 transition-colors duration-150 animate-in fade-in slide-in-from-left-2",
        isCompletedRow
          ? "opacity-50"
          : "hover:bg-secondary/30"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both",
      }}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold",
              isCompletedRow
                ? "bg-muted text-muted-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {customer.name.charAt(0)}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              isCompletedRow ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {customer.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground">{customer.email}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground">{customer.phone}</span>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "text-sm font-medium",
            isCompletedRow ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {customer.totalOrders}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground">
          {customer.lastOrderDate}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            isCompletedRow
              ? "bg-muted text-muted-foreground"
              : cardTypeBg[customer.latestCardType]
          )}
        >
          {customer.latestCardType} Card
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "text-sm",
            isCompletedRow ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {customer.latestCardColor}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            isCompletedRow
              ? "bg-muted text-muted-foreground"
              : "bg-secondary text-foreground"
          )}
        >
          {customer.paymentMethod}
        </span>
      </td>
      <td className="py-4 px-4">
        {isCompletedRow ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-warning/10 text-warning">
            {customer.latestStatus.charAt(0).toUpperCase() + customer.latestStatus.slice(1)}
          </span>
        )}
      </td>
      <td className="py-4 px-4">
        {isCompletedRow ? (
          <button
            onClick={() => onUndoCompleted(customer.email)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-warning/10 hover:text-warning hover:border-warning/30 transition-all duration-200"
            title="Undo - reopen order"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onMarkCompleted(customer.email)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-success/10 hover:text-success hover:border-success/30 transition-all duration-200"
            title="Mark as completed"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );

  const tableHead = (
    <thead>
      <tr className="border-b border-border bg-secondary/50">
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Customer Name
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Email
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Phone
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Total Orders
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Last Order
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Card Type
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Card Color
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Payment
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status
        </th>
        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Action
        </th>
      </tr>
    </thead>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Customers",
            value: totalCustomers.toString(),
            icon: Users,
            color: "text-foreground",
            description: "All-time",
          },
          {
            label: "Total Revenue",
            value: formatCurrencyCompact(totalRevenue, settings.currency),
            icon: DollarSign,
            color: "text-accent",
            description: "Card orders revenue",
          },
          {
            label: "Top Ordered Card",
            value: `${topCardType} Card`,
            icon: CreditCard,
            color: "text-chart-1",
            description: `${topCardCount} orders`,
          },
          {
            label: "Active / Completed",
            value: `${activeCardOrders} / ${completedCardOrders}`,
            icon: ShoppingCart,
            color: "text-warning",
            description: "Processing vs completed",
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="border-border bg-card hover:border-muted-foreground/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
              <p className={cn("text-3xl font-bold mt-1", stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        <div className="relative">
          <select
            value={filterCardType}
            onChange={(e) => setFilterCardType(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent"
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
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent"
          >
            <option value="all">All Payments</option>
            <option value="Crypto">Crypto</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Active Customers Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Active Customers
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredActive.length} customer{filteredActive.length !== 1 ? "s" : ""} with
            open orders
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            {tableHead}
            <tbody>
              {filteredActive.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                      No active customers
                    </p>
                  </td>
                </tr>
              ) : (
                filteredActive.map((customer, index) =>
                  renderRow(customer, index, false)
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Customers Section */}
      {completedCustomers.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setCompletedExpanded(!completedExpanded)}
            className="w-full px-5 py-4 border-b border-border flex items-center justify-between hover:bg-secondary/30 transition-colors duration-200"
          >
            <div className="text-left">
              <h3 className="text-base font-semibold text-muted-foreground">
                Erledigte Kunden
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredCompleted.length} completed customer{filteredCompleted.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ChevronRight
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                completedExpanded && "rotate-90"
              )}
            />
          </button>
          {completedExpanded && (
            <div className="overflow-x-auto">
              <table className="w-full">
                {tableHead}
                <tbody>
                  {filteredCompleted.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <p className="text-muted-foreground text-sm">
                          No completed customers matching filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCompleted.map((customer, index) =>
                      renderRow(customer, index, true)
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
