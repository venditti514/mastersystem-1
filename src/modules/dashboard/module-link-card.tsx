"use client";

import Link from "next/link";
import {
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Landmark,
  ListTree,
  Ship,
  DollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Landmark,
  ListTree,
  Ship,
  DollarSign,
};

interface ModuleLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon: keyof typeof ICON_MAP;
  className?: string;
}

export function ModuleLinkCard({
  href,
  title,
  description,
  icon: iconName,
  className,
}: ModuleLinkCardProps) {
  const Icon = ICON_MAP[iconName];
  return (
    <Link
      href={href}
      className={cn(
        "glass-card group flex items-center justify-between gap-4 p-5 transition-all",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2 transition-colors group-hover:bg-slate-100 dark:bg-slate-800 dark:group-hover:bg-slate-700">
          {Icon && <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-0.5 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
    </Link>
  );
}
