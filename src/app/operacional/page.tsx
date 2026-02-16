"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useOperacionalStore } from "@/lib/store-operacional";
import { formatData } from "@/lib/format";
import type { StatusProcessoOperacional } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function OperacionalDashboardPage() {
  const { processos, atividades } = useOperacionalStore();

  const ativos = useMemo(
    () => processos.filter((p) => p.status === "em_andamento"),
    [processos]
  );
  const porStatus = useMemo(
    () => ({
      em_andamento: processos.filter((p) => p.status === "em_andamento").length,
      finalizado: processos.filter((p) => p.status === "finalizado").length,
      cancelado: processos.filter((p) => p.status === "cancelado").length,
    }),
    [processos]
  );
  const hoje = new Date().toISOString().slice(0, 10);
  const prazosVencidos = useMemo(
    () =>
      atividades.filter(
        (a) =>
          a.status !== "concluida" &&
          a.prazo < hoje
      ),
    [atividades, hoje]
  );
  const proximosVencimentos = useMemo(
    () =>
      atividades
        .filter((a) => a.status !== "concluida" && a.prazo >= hoje)
        .sort((a, b) => a.prazo.localeCompare(b.prazo))
        .slice(0, 5),
    [atividades, hoje]
  );

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard Operacional
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Visão geral de processos, atividades e alertas de prazos
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Processos ativos</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {ativos.length}
          </p>
          <Link
            href="/processos-operacionais"
            className="mt-2 inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Ver processos →
          </Link>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Em andamento</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {porStatus.em_andamento}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Finalizados</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {porStatus.finalizado}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelados</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-500 dark:text-slate-300">
            {porStatus.cancelado}
          </p>
        </div>
      </div>

      {prazosVencidos.length > 0 && (
        <div className="glass-card rounded-xl border-amber-200 bg-amber-50/50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <h3 className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            Alertas de prazos vencidos ({prazosVencidos.length})
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-200 dark:border-amber-700">
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">
                    Tarefa
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">
                    Responsável
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">
                    Prazo
                  </th>
                </tr>
              </thead>
              <tbody>
                {prazosVencidos.map((a) => (
                  <tr key={a.id} className="border-b border-amber-100 dark:border-amber-800/50">
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{a.titulo}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{a.responsavel}</td>
                    <td className="px-4 py-3 text-amber-700 dark:text-amber-400">
                      {formatData(a.prazo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Processos por status
          </h3>
          <div className="mt-4 space-y-3">
            {(
              [
                ["em_andamento", "Em andamento", "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"],
                ["finalizado", "Finalizado", "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"],
                ["cancelado", "Cancelado", "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"],
              ] as [StatusProcessoOperacional, string, string][]
            ).map(([key, label, cls]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-600 dark:bg-slate-800/50"
              >
                <span className={cn("rounded px-2 py-0.5 text-xs font-medium", cls)}>
                  {label}
                </span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {porStatus[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Próximos vencimentos
          </h3>
          {proximosVencimentos.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Nenhuma tarefa com prazo próximo
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {proximosVencimentos.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2 text-sm dark:border-slate-600"
                >
                  <span className="text-slate-900 dark:text-slate-100">{a.titulo}</span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {formatData(a.prazo)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
