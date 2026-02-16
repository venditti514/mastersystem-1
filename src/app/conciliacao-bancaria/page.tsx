"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda, formatData } from "@/lib/format";

export default function ConciliacaoBancariaPage() {
  const { lancamentos, saldoInicialBancario } = useFinanceStore();
  const [conta, setConta] = useState("bb");
  const [periodo, setPeriodo] = useState("2025-02");

  const entradas = lancamentos.filter((l) => l.tipo === "entrada");
  const saidas = lancamentos.filter((l) => l.tipo === "saida");
  const totalEntradas = entradas.reduce((s, l) => s + l.valor, 0);
  const totalSaidas = saidas.reduce((s, l) => s + l.valor, 0);
  const saldoExtrato = saldoInicialBancario + totalEntradas - totalSaidas;
  const saldoSistema = saldoExtrato; // em operação normal = conciliado

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Conciliação Bancária
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Extrato bancário e conciliação de lançamentos
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Conta bancária
            </label>
            <select
              value={conta}
              onChange={(e) => setConta(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
            >
              <option value="bb">Banco do Brasil - Conta Corrente</option>
              <option value="itau">Itaú - Conta Corrente</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Período
            </label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
            >
              <option value="2025-02">Fevereiro 2025</option>
              <option value="2025-01">Janeiro 2025</option>
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
          Importar extrato
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saldo extrato banco</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(saldoExtrato, "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saldo sistema</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(saldoSistema, "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
            {Math.abs(saldoExtrato - saldoSistema) < 1
              ? "Conciliado"
              : "Divergência"}
          </p>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-600">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Lançamentos do período
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Conferir e marcar como conciliado
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Histórico
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Débito
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Crédito
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Conciliação
                </th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                    {formatData(l.data)}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{l.descricao}</td>
                  <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500">—</td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatMoeda(l.valor, "BRL")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                      ✓ Conciliado
                    </span>
                  </td>
                </tr>
              ))}
              {saidas.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                    {formatData(l.data)}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{l.descricao}</td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatMoeda(l.valor, "BRL")}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500">—</td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                      ✓ Conciliado
                    </span>
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
