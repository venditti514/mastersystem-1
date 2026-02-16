"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda, formatData } from "@/lib/format";
import type { ContaReceber, Moeda, TipoOperacao } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ContasAReceberPage() {
  const { contasReceber, addContaReceber, updateContaReceber, ptaxUSD } =
    useFinanceStore();
  const [filtro, setFiltro] = useState<string>("todas");
  const [busca, setBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ContaReceber>>({
    cliente: "",
    descricao: "",
    vencimento: new Date().toISOString().slice(0, 10),
    valor: 0,
    moeda: "BRL",
    status: "a_receber",
    tipo: "nacional",
  });

  const filtered = contasReceber.filter((c) => {
    if (filtro !== "todas" && c.status !== filtro) return false;
    const termo = busca.toLowerCase();
    return (
      !termo ||
      c.cliente.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo)
    );
  });

  const aReceber = contasReceber.filter((c) =>
    ["a_receber", "em_atraso"].includes(c.status)
  );
  const recebido = contasReceber.filter((c) => c.status === "recebido");
  const emAtraso = contasReceber.filter((c) => c.status === "em_atraso");

  const total = (list: ContaReceber[]) =>
    list.reduce(
      (s, c) => s + (c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD),
      0
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente || !form.descricao || !form.vencimento || !form.valor)
      return;
    addContaReceber({
      cliente: form.cliente,
      descricao: form.descricao,
      vencimento: form.vencimento,
      valor: form.valor,
      moeda: form.moeda ?? "BRL",
      status: form.status ?? "a_receber",
      tipo: form.tipo ?? "nacional",
      nrOperacao: form.nrOperacao,
    });
    setForm({
      cliente: "",
      descricao: "",
      vencimento: new Date().toISOString().slice(0, 10),
      valor: 0,
      moeda: "BRL",
      status: "a_receber",
      tipo: "nacional",
    });
    setShowForm(false);
  };

  const valorEmBRL = (c: ContaReceber) =>
    c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD;

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Contas a Receber · Comex
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Exportação, vendas nacionais e inadimplência
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">A receber (30 dias)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(total(aReceber), "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Em atraso</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {formatMoeda(total(emAtraso), "BRL")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recebido este mês</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatMoeda(total(recebido), "BRL")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(["todas", "a_receber", "recebido", "em_atraso"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFiltro(s)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      filtro === s
                        ? "border border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    )}
                  >
                    {s === "todas"
                      ? "Todas"
                      : s === "a_receber"
                        ? "A receber"
                        : s === "em_atraso"
                          ? "Em atraso"
                          : "Recebidas"}
                  </button>
                )
              )}
            </div>
            <input
              type="search"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-48 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-800 dark:focus:ring-slate-600"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            {showForm ? "Cancelar" : "+ Nova receita"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="glass-card space-y-5 rounded-xl p-6"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Nova conta a receber
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Cliente
                </label>
                <input
                  required
                  value={form.cliente}
                  onChange={(e) =>
                    setForm({ ...form, cliente: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Descrição / NF
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
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Vencimento
                </label>
                <input
                  type="date"
                  required
                  value={form.vencimento}
                  onChange={(e) =>
                    setForm({ ...form, vencimento: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.valor || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      valor: parseFloat(e.target.value) || 0,
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
                  onChange={(e) =>
                    setForm({ ...form, moeda: e.target.value as Moeda })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                >
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
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
                  <option value="nacional">Nacional</option>
                  <option value="exportacao">Exportação</option>
                </select>
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
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{c.cliente}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{c.descricao}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          c.tipo === "exportacao"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        )}
                      >
                        {c.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                      {formatData(c.vencimento)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                        {formatMoeda(c.valor, c.moeda)}
                      </span>
                      {c.moeda !== "BRL" && (
                        <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                          ≈ {formatMoeda(valorEmBRL(c), "BRL")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          c.status === "em_atraso" && "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
                          c.status === "a_receber" && "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                          c.status === "recebido" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                        )}
                      >
                        {c.status === "a_receber"
                          ? "A receber"
                          : c.status === "em_atraso"
                            ? "Em atraso"
                            : "Recebido"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.status === "a_receber" && (
                        <button
                          onClick={() =>
                            updateContaReceber(c.id, { status: "recebido" })
                          }
                          className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                        >
                          Marcar recebido
                        </button>
                      )}
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
