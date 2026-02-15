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
} from "lucide-react";

type CardType = "Pro" | "Elite" | "Ultra";
type PaymentMethod = "Crypto" | "Bank Transfer";

const cardPrices: Record<CardType, number> = {
  Pro: 1449,
  Elite: 3599,
  Ultra: 14499,
};

interface CustomerOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  cardType: CardType;
  cardColor: string;
  paymentMethod: PaymentMethod;
  orderDate: string;
  status: "Processing" | "Completed";
}

const initialOrders: CustomerOrder[] = [
  { id: "1", customerName: "Alexander Müller", email: "a.mueller@mail.ch", phone: "+41 79 123 4567", cardType: "Ultra", cardColor: "24K Gold Edition", paymentMethod: "Crypto", orderDate: "2026-02-10", status: "Processing" },
  { id: "2", customerName: "Sophie Laurent", email: "sophie.l@mail.fr", phone: "+33 6 12 34 56 78", cardType: "Elite", cardColor: "Matte Black", paymentMethod: "Bank Transfer", orderDate: "2026-02-08", status: "Processing" },
  { id: "3", customerName: "James Whitfield", email: "j.whitfield@mail.uk", phone: "+44 7700 900123", cardType: "Pro", cardColor: "Rainbow", paymentMethod: "Crypto", orderDate: "2026-02-06", status: "Completed" },
  { id: "4", customerName: "Lena Fischer", email: "lena.f@mail.de", phone: "+49 170 1234567", cardType: "Ultra", cardColor: "Brushed Black", paymentMethod: "Bank Transfer", orderDate: "2026-02-05", status: "Processing" },
  { id: "5", customerName: "Marco Rossi", email: "m.rossi@mail.it", phone: "+39 345 678 9012", cardType: "Elite", cardColor: "White", paymentMethod: "Crypto", orderDate: "2026-02-04", status: "Completed" },
  { id: "6", customerName: "Yuki Tanaka", email: "y.tanaka@mail.jp", phone: "+81 90 1234 5678", cardType: "Pro", cardColor: "Stainless Steel", paymentMethod: "Bank Transfer", orderDate: "2026-02-03", status: "Completed" },
  { id: "7", customerName: "Elena Petrova", email: "e.petrova@mail.ae", phone: "+971 50 123 4567", cardType: "Ultra", cardColor: "Glossy Black", paymentMethod: "Crypto", orderDate: "2026-02-09", status: "Processing" },
  { id: "8", customerName: "Carlos Mendez", email: "c.mendez@mail.mx", phone: "+52 55 1234 5678", cardType: "Pro", cardColor: "Blue", paymentMethod: "Bank Transfer", orderDate: "2026-02-07", status: "Completed" },
];

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(value);
}

function formatEuroCompact(value: number): string {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(1)}K`;
  }
  return formatEuro(value);
}

export function CustomersSection() {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCardType, setFilterCardType] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Aggregate customers from orders
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    lastOrderDate: string;
    latestCardType: CardType;
    latestCardColor: string;
    paymentMethod: PaymentMethod;
    latestStatus: "Processing" | "Completed";
    latestOrderId: string;
  }>();

  orders.forEach((order) => {
    const existing = customerMap.get(order.email);
    if (!existing || new Date(order.orderDate) > new Date(existing.lastOrderDate)) {
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
        latestOrderId: order.id,
      });
    }
  });

  const customers = Array.from(customerMap.values());

  // KPIs
  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce((sum, o) => sum + cardPrices[o.cardType], 0);
  const activeCardOrders = orders.filter((o) => o.status === "Processing").length;

  // Top ordered card type
  const cardTypeCounts: Record<CardType, number> = { Pro: 0, Elite: 0, Ultra: 0 };
  orders.forEach((o) => cardTypeCounts[o.cardType]++);
  const topCardType = (Object.entries(cardTypeCounts) as [CardType, number][]).sort((a, b) => b[1] - a[1])[0][0];

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterCardType === "all" || c.latestCardType === filterCardType;
    const matchesPayment = filterPayment === "all" || c.paymentMethod === filterPayment;
    const matchesStatus = filterStatus === "all" || c.latestStatus === filterStatus;
    return matchesSearch && matchesType && matchesPayment && matchesStatus;
  });

  const handleMarkCompleted = (email: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.email === email && o.status === "Processing" ? { ...o, status: "Completed" as const } : o
      )
    );
  };

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
            value: formatEuroCompact(totalRevenue),
            icon: DollarSign,
            color: "text-accent",
            description: "Card orders revenue",
          },
          {
            label: "Top Ordered Card",
            value: `${topCardType} Card`,
            icon: CreditCard,
            color: "text-chart-1",
            description: `${cardTypeCounts[topCardType]} orders`,
          },
          {
            label: "Active Card Orders",
            value: activeCardOrders.toString(),
            icon: ShoppingCart,
            color: "text-warning",
            description: "Not yet completed",
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="border-border bg-card hover:border-muted-foreground/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <p className={cn("text-3xl font-bold mt-1", stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Customers with Card Orders</h3>
          <p className="text-sm text-muted-foreground mt-0.5">All-time customer data</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Color</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <p className="text-muted-foreground text-sm">No customers yet</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => {
                  const cardTypeBg: Record<CardType, string> = {
                    Pro: "bg-chart-1/10 text-chart-1",
                    Elite: "bg-accent/10 text-accent",
                    Ultra: "bg-warning/10 text-warning",
                  };

                  return (
                    <tr
                      key={customer.email}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-150 animate-in fade-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{customer.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{customer.phone}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-foreground">{customer.totalOrders}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{customer.lastOrderDate}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn("px-2 py-1 rounded-md text-xs font-medium", cardTypeBg[customer.latestCardType])}>
                          {customer.latestCardType} Card
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground">{customer.latestCardColor}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-foreground">
                          {customer.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                          customer.latestStatus === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        )}>
                          {customer.latestStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {customer.latestStatus === "Processing" ? (
                          <button
                            onClick={() => handleMarkCompleted(customer.email)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-success/10 hover:text-success hover:border-success/30 transition-all duration-200"
                            title="Mark as completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-success/10">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length} customers
          </span>
        </div>
      </div>
    </div>
  );
}
