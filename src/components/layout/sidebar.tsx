"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Landmark,
  ListTree,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Ship,
  DollarSign,
  ClipboardList,
  ListTodo,
  Globe,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof Wallet };
type NavSection = { title: string | null; items: NavItem[] };

const navSections: NavSection[] = [
  {
    title: null,
    items: [{ href: "/", label: "Visão Geral", icon: LayoutDashboard }],
  },
  {
    title: "Financeiro",
    items: [
      { href: "/financeiro", label: "Financeiro", icon: Wallet },
      { href: "/operacoes-comex", label: "Operações Comex", icon: Ship },
      { href: "/comercio-exterior", label: "Comércio Exterior", icon: Globe },
      { href: "/cambio", label: "Câmbio / PTAX", icon: DollarSign },
      { href: "/contas-a-pagar", label: "Contas a Pagar", icon: ArrowDownCircle },
      { href: "/contas-a-receber", label: "Contas a Receber", icon: ArrowUpCircle },
      { href: "/fluxo-de-caixa", label: "Fluxo de Caixa", icon: TrendingUp },
      { href: "/conciliacao-bancaria", label: "Conciliação Bancária", icon: Landmark },
      { href: "/plano-de-contas", label: "Plano de Contas", icon: ListTree },
      { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    title: "Operacional",
    items: [
      { href: "/operacional", label: "Operacional", icon: ClipboardList },
      { href: "/processos-operacionais", label: "Processos Operacionais", icon: ListTodo },
      { href: "/automacao", label: "Automação", icon: Zap },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();

  const handleToggle = () => {
    onCollapsedChange?.(!collapsed);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 transition-all duration-300",
        "backdrop-blur-md bg-white dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="relative flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2",
            collapsed && "mx-auto"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
            <Wallet className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">MasterPort Comex</span>
          )}
        </Link>
        {!collapsed && (
        <button
          onClick={handleToggle}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        )}
        {collapsed && (
          <button
            onClick={handleToggle}
            className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:bg-slate-50 hover:text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title ?? sectionIndex} className="space-y-1">
            {section.title && !collapsed && (
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-slate-100 text-slate-900 border-l-2 border-slate-900 pl-[14px] dark:bg-slate-800 dark:text-slate-100 dark:border-slate-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive && "text-slate-900 dark:text-slate-100"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

    </aside>
  );
}
