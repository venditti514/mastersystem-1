"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <Navbar />
        <main className="min-h-[calc(100vh-3.5rem)] p-8">{children}</main>
      </div>
    </div>
  );
}
