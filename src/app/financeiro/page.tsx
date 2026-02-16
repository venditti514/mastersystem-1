"use client";

import { GlassCard } from "@/modules/dashboard/glass-card";
import { ModuleLinkCard } from "@/modules/dashboard/module-link-card";
import { useFinanceStore } from "@/lib/store";
import { formatMoeda } from "@/lib/format";

export default function FinanceiroPage() {
  const { contasPagar, contasReceber, operacoesComex, ptaxUSD } =
    useFinanceStore();

  const aPagar = contasPagar.filter((c) =>
    ["pendente", "vencido"].includes(c.status)
  );
  const aReceber = contasReceber.filter((c) =>
    ["a_receber", "em_atraso"].includes(c.status)
  );
  const totalAPagar = aPagar.reduce(
    (s, c) => s + (c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD),
    0
  );
  const totalAReceber = aReceber.reduce(
    (s, c) => s + (c.moeda === "BRL" ? c.valor : c.valor * ptaxUSD),
    0
  );
  const emOperacao = operacoesComex.filter((o) => o.status === "em_andamento");
  const valorOperacoes = emOperacao.reduce((s, o) => s + o.valorBRL, 0);

  return (
    <div className="space-y-10">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Financeiro · Comércio Exterior
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Controle de operações de importação/exportação e fluxo de caixa
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Indicadores financeiros
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard
            title="PTAX USD (compra)"
            value={formatMoeda(ptaxUSD, "BRL")}
            subtitle="Cotação vigente"
            icon="DollarSign"
          />
          <GlassCard
            title="Operações em andamento"
            value={formatMoeda(valorOperacoes, "BRL")}
            subtitle={`${emOperacao.length} operações ativas`}
            icon="Ship"
          />
          <GlassCard
            title="Contas a receber"
            value={formatMoeda(totalAReceber, "BRL")}
            subtitle="Convertido em BRL"
            icon="ArrowUpCircle"
            trend={{
              value: aReceber.filter((c) => c.status === "em_atraso").length,
              isPositive: false,
              label: "em atraso",
            }}
          />
          <GlassCard
            title="Contas a pagar"
            value={formatMoeda(totalAPagar, "BRL")}
            subtitle="Convertido em BRL"
            icon="ArrowDownCircle"
            trend={{
              value: aPagar.filter((c) => c.status === "vencido").length,
              isPositive: false,
              label: "vencidas",
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Módulos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ModuleLinkCard
            href="/operacoes-comex"
            title="Operações Comex"
            description="Importação, exportação e acompanhamento"
            icon="Ship"
          />
          <ModuleLinkCard
            href="/cambio"
            title="Câmbio / PTAX"
            description="Cotações e hedge cambial"
            icon="DollarSign"
          />
          <ModuleLinkCard
            href="/contas-a-pagar"
            title="Contas a Pagar"
            description="Fornecedores, II, frete e despesas"
            icon="ArrowDownCircle"
          />
          <ModuleLinkCard
            href="/contas-a-receber"
            title="Contas a Receber"
            description="Exportação e vendas nacionais"
            icon="ArrowUpCircle"
          />
          <ModuleLinkCard
            href="/fluxo-de-caixa"
            title="Fluxo de Caixa"
            description="Multi-moeda e projeção"
            icon="TrendingUp"
          />
          <ModuleLinkCard
            href="/conciliacao-bancaria"
            title="Conciliação Bancária"
            description="Extrato e conferência"
            icon="Landmark"
          />
        </div>
      </section>
    </div>
  );
}
