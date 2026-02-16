"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda } from "@/lib/format";

export default function CambioPage() {
  const { cotacoes, ptaxUSD, setPtaxUSD } = useFinanceStore();
  const [editPtax, setEditPtax] = useState(false);
  const [novoPtax, setNovoPtax] = useState(ptaxUSD.toString());

  const handleSavePtax = () => {
    const v = parseFloat(novoPtax.replace(",", "."));
    if (!isNaN(v) && v > 0) {
      setPtaxUSD(v);
      setEditPtax(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Câmbio / PTAX
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Cotações vigentes e cotação de referência para conversão
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            PTAX USD (compra)
          </h3>
          {editPtax ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">R$</span>
              <input
                type="text"
                value={novoPtax}
                onChange={(e) => setNovoPtax(e.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
              <button
                type="button"
                onClick={handleSavePtax}
                className="text-sm font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditPtax(false);
                  setNovoPtax(ptaxUSD.toString());
                }}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatMoeda(ptaxUSD, "BRL")}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cotação de referência para conversão
          </p>
          {!editPtax && (
            <button
              type="button"
              onClick={() => {
                setEditPtax(true);
                setNovoPtax(ptaxUSD.toString());
              }}
              className="mt-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              Editar cotação
            </button>
          )}
        </div>

        {cotacoes.map((c) => (
          <div key={c.moeda} className="glass-card rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {c.moeda} — {c.data}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Compra</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  R$ {c.compra.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Venda</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  R$ {c.venda.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Conversor</h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Utilize a PTAX vigente para converter valores. Ex: US$ 10.000 = R${" "}
          {(10000 * ptaxUSD).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 transition-colors hover:bg-slate-100/80 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">US$ 1.000 =</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatMoeda(1000 * ptaxUSD, "BRL")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 transition-colors hover:bg-slate-100/80 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">US$ 10.000 =</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatMoeda(10000 * ptaxUSD, "BRL")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 transition-colors hover:bg-slate-100/80 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">US$ 100.000 =</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatMoeda(100000 * ptaxUSD, "BRL")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
