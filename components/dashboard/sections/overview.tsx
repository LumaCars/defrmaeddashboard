"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { PipelineOverview } from "@/components/dashboard/charts/pipeline-overview";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { TopPerformers } from "@/components/dashboard/top-performers";
import { DollarSign, CreditCard, Users, ShoppingCart } from "lucide-react";
import { type CustomerOrder, cardPrices } from "@/lib/orders-data";
import { useSettings, formatCurrencyCompact } from "@/lib/settings-context";

interface OverviewSectionProps {
  orders: CustomerOrder[];
  loading?: boolean;
}

export function OverviewSection({ orders, loading }: OverviewSectionProps) {
  const { settings } = useSettings();
  const { currency } = settings;

  const totalRevenue = orders.reduce((sum, o) => sum + cardPrices[o.cardType], 0);
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== "completed").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrencyCompact(totalRevenue, currency)}
          change={`${completedOrders} completed`}
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <MetricCard
          title="Card Orders"
          value={totalOrders.toString()}
          change={`${activeOrders} active`}
          changeType="positive"
          icon={CreditCard}
          delay={1}
        />
        <MetricCard
          title="Active Orders"
          value={activeOrders.toString()}
          change="Open"
          changeType="neutral"
          icon={ShoppingCart}
          delay={2}
        />
        <MetricCard
          title="Total Customers"
          value={uniqueCustomers.toString()}
          change={`${completedOrders} completed`}
          changeType="positive"
          icon={Users}
          delay={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PipelineOverview orders={orders} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeals orders={orders} />
        <TopPerformers orders={orders} />
      </div>
    </div>
  );
}
