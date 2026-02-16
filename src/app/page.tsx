"use client";

import Link from "next/link";
import { DollarSign, ClipboardList, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          MasterPort Comex
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Escolha a área para acessar
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Acesso rápido
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/financeiro"
            className={cn(
              "glass-card group flex items-center justify-between gap-6 rounded-xl p-6 transition-all",
              "hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-200 dark:bg-slate-800 dark:group-hover:bg-slate-700">
                <DollarSign className="h-7 w-7 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Financeiro
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Contas a pagar e receber, fluxo de caixa, câmbio e conciliação
                </p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
          </Link>

          <Link
            href="/operacional"
            className={cn(
              "glass-card group flex items-center justify-between gap-6 rounded-xl p-6 transition-all",
              "hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-200 dark:bg-slate-800 dark:group-hover:bg-slate-700">
                <ClipboardList className="h-7 w-7 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Operacional
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Processos, atividades, prazos e dashboard operacional
                </p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}
