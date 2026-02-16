"use client";

import { cn } from "@/lib/utils";
import {
  DollarSign,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Landmark,
  AlertCircle,
  Ship,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Landmark,
  AlertCircle,
  Ship,
};

interface GlassCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon | keyof typeof ICON_MAP;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export function GlassCard({
  title,
  value,
  subtitle,
  icon: iconProp,
  trend,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              {trend.label && (
                <span className="ml-1 font-normal text-slate-500 dark:text-slate-400">
                  {trend.label}
                </span>
              )}
            </p>
          )}
        </div>
        {((): React.ReactNode => {
          const Icon =
            typeof iconProp === "string" ? ICON_MAP[iconProp] : iconProp;
          return Icon ? (
            <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}
