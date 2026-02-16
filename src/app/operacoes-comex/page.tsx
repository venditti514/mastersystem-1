"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda, formatData } from "@/lib/format";
import type { OperacaoComex, TipoOperacao } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function OperacoesComexPage() {
  const { operacoesComex, addOperacao, cotacoes } = useFinanceStore();
  const [filtro, setFiltro] = useState<TipoOperacao | "todas">("todas");
  const [busca, setBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<OperacaoComex>>({
    numero: "",
    tipo: "importacao",
    descricao: "",
    valorOriginal: 0,
    moeda: "USD",
    cotacao: 5.845,
    dataOperacao: new Date().toISOString().slice(0, 10),
    status: "em_andamento",
    incoterm: "",
  });

  const cotacaoUSD = cotacoes.find((c) => c.moeda === "USD")?.compra ?? 5.847;

  const filtered = operacoesComex.filter((o) => {
    if (filtro !== "todas" && o.tipo !== filtro) return false;
    const termo = busca.toLowerCase();
    return (
      !termo ||
      o.numero.toLowerCase().includes(termo) ||
      o.descricao.toLowerCase().includes(termo)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.numero ||
      !form.descricao ||
      !form.valorOriginal ||
      !form.dataOperacao
    )
      return;
    const cot = form.moeda === "USD" ? cotacaoUSD : 6.31;
    addOperacao({
      numero: form.numero,
      tipo: form.tipo ?? "importacao",
      descricao: form.descricao,
      valorOriginal: form.valorOriginal,
      moeda: form.moeda ?? "USD",
      valorBRL: form.valorOriginal * cot,
      cotacao: cot,
      dataOperacao: form.dataOperacao,
      status: form.status ?? "em_andamento",
      incoterm: form.incoterm,
    });
    setForm({
      numero: "",
      tipo: "importacao",
      descricao: "",
      valorOriginal: 0,
      moeda: "USD",
      cotacao: cotacaoUSD,
      dataOperacao: new Date().toISOString().slice(0, 10),
      status: "em_andamento",
      incoterm: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Operações de Comércio Exterior
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Importação, exportação e acompanhamento de operações
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(["todas", "importacao", "exportacao"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFiltro(s)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    filtro === s
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  )}
                >
                  {s === "todas" ? "Todas" : s === "importacao" ? "Importação" : "Exportação"}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Buscar por número ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-64 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-800 dark:focus:ring-slate-600"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            {showForm ? "Cancelar" : "+ Nova operação"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="glass-card space-y-5 rounded-xl p-6"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Nova operação Comex
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Número
                </label>
                <input
                  required
                  placeholder="IMP-2025-003"
                  value={form.numero}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Tipo
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) =>
                    setForm({ ...form, tipo: e.target.value as TipoOperacao })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                >
                  <option value="importacao">Importação</option>
                  <option value="exportacao">Exportação</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Descrição
                </label>
                <input
                  required
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Valor original
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.valorOriginal || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      valorOriginal: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Moeda
                </label>
                <select
                  value={form.moeda}
                  onChange={(e) => {
                    const m = e.target.value as "USD" | "EUR";
                    const cot = m === "USD" ? cotacaoUSD : 6.31;
                    setForm({
                      ...form,
                      moeda: m,
                      cotacao: cot,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={form.dataOperacao}
                  onChange={(e) =>
                    setForm({ ...form, dataOperacao: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Incoterm
                </label>
                <input
                  placeholder="FOB Santos, CIF..."
                  value={form.incoterm || ""}
                  onChange={(e) =>
                    setForm({ ...form, incoterm: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Salvar
            </button>
          </form>
        )}

        <div className="glass-card overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Número
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Data
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    BRL
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-700 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {o.numero}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                          o.tipo === "importacao"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        )}
                      >
                        {o.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{o.descricao}</td>
                    <td className="px-6 py-4 text-sm tabular-nums text-slate-500 dark:text-slate-400">
                      {formatData(o.dataOperacao)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatMoeda(o.valorOriginal, o.moeda)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatMoeda(o.valorBRL, "BRL")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          o.status === "em_andamento" &&
                            "bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
                          o.status === "liquidado" &&
                            "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
                          o.status === "cancelado" &&
                            "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200"
                        )}
                      >
                        {o.status === "em_andamento"
                          ? "Em andamento"
                          : o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
