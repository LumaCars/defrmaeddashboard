"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { DealsSection } from "@/components/dashboard/sections/deals";
import { CustomersSection } from "@/components/dashboard/sections/customers";
import { TeamSection } from "@/components/dashboard/sections/team";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import { type CustomerOrder, type DbCardOrder, mapDbOrder } from "@/lib/orders-data";
import { SettingsProvider } from "@/lib/settings-context";

export type Section = "overview" | "deals" | "customers" | "team" | "settings";

function DashboardContent() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      const mapped = (json.data as DbCardOrder[]).map(mapDbOrder);
      setOrders(mapped);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const persistStatus = useCallback(async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error persisting status:", err);
      fetchOrders();
    }
  }, [fetchOrders]);

  const handleMarkCompleted = useCallback((email: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.email === email && o.status !== "completed"
          ? { ...o, status: "completed" }
          : o
      );
      prev.forEach((o) => {
        if (o.email === email && o.status !== "completed") {
          persistStatus(o.id, "completed");
        }
      });
      return updated;
    });
  }, [persistStatus]);

  const handleUndoCompleted = useCallback((email: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.email === email && o.status === "completed"
          ? { ...o, status: "new" }
          : o
      );
      prev.forEach((o) => {
        if (o.email === email && o.status === "completed") {
          persistStatus(o.id, "new");
        }
      });
      return updated;
    });
  }, [persistStatus]);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection orders={orders} loading={loading} />;
      case "deals":
        return <DealsSection orders={orders} loading={loading} />;
      case "customers":
        return (
          <CustomersSection
            orders={orders}
            onMarkCompleted={handleMarkCompleted}
            onUndoCompleted={handleUndoCompleted}
            loading={loading}
          />
        );
      case "team":
        return <TeamSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection orders={orders} loading={loading} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        <Header activeSection={activeSection} />
        <main className="flex-1 p-6 overflow-auto">
          <div
            key={activeSection}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SettingsProvider>
      <DashboardContent />
    </SettingsProvider>
  );
}
