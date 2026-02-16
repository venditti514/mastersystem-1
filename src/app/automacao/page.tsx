"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileCheck,
  Bell,
  RefreshCw,
  FileText,
  Mail,
  Ship,
  Play,
  Loader2,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

const automationCards = [
  {
    id: "provisao-di",
    title: "Provisão financeira a partir de DI",
    description:
      "Cria automaticamente contas a pagar (II, PIS, COFINS, frete) quando um DI é registrado no controle aduaneiro.",
    icon: FileCheck,
    status: "ativo",
  },
  {
    id: "notificacao-prazo",
    title: "Notificação de prazos",
    description:
      "Envia alertas por e-mail quando tarefas operacionais ou vencimentos de contas estão próximos ou vencidos.",
    icon: Bell,
    status: "ativo",
  },
  {
    id: "sincronizacao-ptax",
    title: "Sincronização PTAX",
    description:
      "Atualiza cotações de câmbio (USD/EUR) diariamente com base em fonte oficial para conversão em BRL.",
    icon: RefreshCw,
    status: "ativo",
  },
  {
    id: "geracao-invoice",
    title: "Geração de Invoice e Packing List",
    description:
      "Gera documentos de exportação a partir dos dados do processo e envia para o cliente internacional.",
    icon: FileText,
    status: "inativo",
  },
  {
    id: "status-comex",
    title: "Atualização de status Comex",
    description:
      "Sincroniza status de embarque/chegada das operações com a timeline e notifica responsáveis.",
    icon: Ship,
    status: "inativo",
  },
  {
    id: "resumo-financeiro",
    title: "Resumo financeiro semanal",
    description:
      "Envia e-mail resumido com totais a pagar, a receber e previsão de fluxo de caixa para os próximos 30 dias.",
    icon: Mail,
    status: "inativo",
  },
];

export default function AutomacaoPage() {
  const [cards, setCards] = useState(automationCards);
  const [cardAberto, setCardAberto] = useState<string | null>(null);
  const [executando, setExecutando] = useState<string | null>(null);
  const [executado, setExecutado] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "ativo" ? "inativo" : "ativo" }
          : c
      )
    );
  };

  const abrirCard = (id: string) => {
    setCardAberto(id);
    setExecutando(null);
    setExecutado(null);
  };

  const executarAutomação = () => {
    if (!cardAberto) return;
    setExecutando(cardAberto);
    setExecutado(null);
    setTimeout(() => {
      setExecutando(null);
      setExecutado(cardAberto);
    }, 1500);
  };

  const fecharCard = () => {
    setCardAberto(null);
    setExecutando(null);
    setExecutado(null);
  };

  const cardAbertoData = cardAberto
    ? cards.find((c) => c.id === cardAberto)
    : null;
  const estaExecutando = cardAberto ? executando === cardAberto : false;
  const foiExecutado = cardAberto ? executado === cardAberto : false;

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Automação
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Regras e gatilhos automáticos. Execute manualmente ou deixe ativo para rodar no agendamento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={cn(
                "glass-card flex flex-col rounded-xl p-5 transition-all",
                "hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(card.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    card.status === "ativo"
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                  )}
                >
                  {card.status === "ativo" ? "Ativo" : "Inativo"}
                </button>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                {card.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => abrirCard(card.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Abrir
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cardAbertoData && (
        <>
          <div
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm"
            onClick={fecharCard}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="glass-card relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={fecharCard}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
              {(() => {
                const Icon = cardAbertoData.icon;
                return (
                  <>
                    <div className="flex items-start justify-between gap-3 pr-8">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700">
                        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleStatus(cardAbertoData.id)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          cardAbertoData.status === "ativo"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                        )}
                      >
                        {cardAbertoData.status === "ativo"
                          ? "Ativo"
                          : "Inativo"}
                      </button>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {cardAbertoData.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                      {cardAbertoData.description}
                    </p>

                    <div className="mt-6 border-t border-slate-200 dark:border-slate-600 pt-6">
                      {!estaExecutando && !foiExecutado && (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={executarAutomação}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                          >
                            <Play className="h-4 w-4" />
                            Executar
                          </button>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Execute esta automação manualmente.
                          </p>
                        </div>
                      )}
                      {(estaExecutando || foiExecutado) && (
                        <div
                          className={cn(
                            "rounded-lg border p-4 text-sm",
                            estaExecutando &&
                              "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
                            foiExecutado &&
                              "border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                          )}
                        >
                          {estaExecutando && (
                            <div className="flex items-center gap-3">
                              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-amber-600 dark:text-amber-400" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                  Executando automação...
                                </p>
                                <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
                                  Processando regras e disparando ações.
                                </p>
                              </div>
                            </div>
                          )}
                          {foiExecutado && !estaExecutando && (
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                                  <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-200" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    Execução concluída
                                  </p>
                                  <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                                    Automação finalizada com sucesso.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={fecharCard}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                              >
                                Fechar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
