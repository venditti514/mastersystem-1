"use client";

import { useMemo, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda, formatData } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FluxoDeCaixaPage() {
  const { lancamentos, contasPagar, contasReceber, ptaxUSD } =
    useFinanceStore();
  const [periodo, setPeriodo] = useState<"mes" | "30" | "60">("mes");

  const entradas = useMemo(
    () =>
      lancamentos
        .filter((l) => l.tipo === "entrada")
        .reduce((s, l) => s + l.valor, 0),
    [lancamentos]
  );
  const saidas = useMemo(
    () =>
      lancamentos
        .filter((l) => l.tipo === "saida")
        .reduce((s, l) => s + l.valor, 0),
    [lancamentos]
  );
  const saldo = entradas - saidas;

  const aReceber = contasReceber
    .filter((c) => ["a_receber", "em_atraso"].includes(c.status))
    .reduce(
      (s, c) => s + (c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD),
      0
    );
  const aPagar = contasPagar
    .filter((c) => ["pendente", "vencido"].includes(c.status))
    .reduce(
      (s, c) => s + (c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD),
      0
    );

  const chartData = useMemo(() => {
    const byCategoria = lancamentos.reduce(
      (acc, l) => {
        const key = l.categoria;
        if (!acc[key]) acc[key] = { entrada: 0, saida: 0 };
        if (l.tipo === "entrada") acc[key].entrada += l.valor;
        else acc[key].saida += l.valor;
        return acc;
      },
      {} as Record<string, { entrada: number; saida: number }>
    );
    return Object.entries(byCategoria).map(([name, v]) => ({
      name,
      Entradas: v.entrada,
      Saídas: v.saida,
    }));
  }, [lancamentos]);

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Fluxo de Caixa · Multi-moeda
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Entradas, saídas e projeção convertidos em BRL
        </p>
      </div>

      <div className="flex gap-2">
        {(["mes", "30", "60"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              periodo === p
                ? "border border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            {p === "mes" ? "Mês atual" : p === "30" ? "30 dias" : "60 dias"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total entradas</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(entradas, "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total saídas</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {formatMoeda(saidas, "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saldo líquido</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(saldo, "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Previsão (a receber − a pagar)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(aReceber - aPagar, "BRL")}
          </p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Fluxo por categoria
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(v) =>
                    `R$ ${(v / 1000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    formatMoeda(value, "BRL"),
                    "",
                  ]}
                />
                <Legend />
                <Bar dataKey="Entradas" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden rounded-xl">
        <h3 className="border-b border-slate-200 px-6 py-4 font-semibold text-slate-900 dark:border-slate-600 dark:text-slate-100">
          Lançamentos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Categoria
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                    {formatData(l.data)}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{l.descricao}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{l.categoria}</td>
                  <td
                    className={`px-6 py-4 text-right font-medium tabular-nums ${
                      l.tipo === "entrada" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {l.tipo === "entrada" ? "+" : "−"}{" "}
                    {formatMoeda(l.valor, "BRL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
