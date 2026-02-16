"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { DealsSection } from "@/components/dashboard/sections/deals";
import { CustomersSection } from "@/components/dashboard/sections/customers";
import { TeamSection } from "@/components/dashboard/sections/team";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import { SignInPage } from "@/components/sign-in/sign-in-page";
import { initialOrders, type CustomerOrder } from "@/lib/orders-data";

export type Section = "overview" | "deals" | "customers" | "team" | "settings";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);

  const handleMarkCompleted = (email: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.email === email && o.status === "Processing"
          ? { ...o, status: "Completed" as const }
          : o
      )
    );
  };

  const handleUndoCompleted = (email: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.email === email && o.status === "Completed"
          ? { ...o, status: "Processing" as const }
          : o
      )
    );
  };

  if (!isLoggedIn) {
    return <SignInPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection orders={orders} />;
      case "deals":
        return <DealsSection />;
      case "customers":
        return (
          <CustomersSection
            orders={orders}
            onMarkCompleted={handleMarkCompleted}
            onUndoCompleted={handleUndoCompleted}
          />
        );
      case "team":
        return <TeamSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection orders={orders} />;
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
