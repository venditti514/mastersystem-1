"use client";

import { useState } from "react";
import Link from "next/link";
import { useOperacionalStore } from "@/lib/store-operacional";
import { formatData } from "@/lib/format";
import type {
  ProcessoOperacional,
  Atividade,
  StatusProcessoOperacional,
  StatusAtividade,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const statusProcessoOptions: { value: StatusProcessoOperacional; label: string }[] = [
  { value: "em_andamento", label: "Em andamento" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
];

const statusAtividadeOptions: { value: StatusAtividade; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "atrasada", label: "Atrasada" },
];

export default function ProcessosOperacionaisPage() {
  const {
    processos,
    atividades,
    addProcesso,
    updateProcesso,
    addAtividade,
    updateAtividade,
    addHistoricoAtividade,
    addDocumento,
  } = useOperacionalStore();

  const [filtro, setFiltro] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [showFormProcesso, setShowFormProcesso] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFormAtividade, setShowFormAtividade] = useState<string | null>(null);
  const [formProcesso, setFormProcesso] = useState<Partial<ProcessoOperacional>>({
    titulo: "",
    descricao: "",
    status: "em_andamento",
    clienteNome: "",
    contratoRef: "",
  });
  const [formAtividade, setFormAtividade] = useState<Partial<Atividade>>({
    titulo: "",
    responsavel: "",
    prazo: new Date().toISOString().slice(0, 10),
    status: "pendente",
  });
  const [novoDocNome, setNovoDocNome] = useState("");

  const filtered = processos.filter((p) => {
    if (filtro !== "todos" && p.status !== filtro) return false;
    const termo = busca.toLowerCase();
    return (
      !termo ||
      p.titulo.toLowerCase().includes(termo) ||
      p.clienteNome.toLowerCase().includes(termo)
    );
  });

  const getAtividadesByProcesso = (processoId: string) =>
    atividades.filter((a) => a.processoId === processoId);

  const handleSubmitProcesso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProcesso.titulo || !formProcesso.clienteNome) return;
    const hoje = new Date().toISOString().slice(0, 10);
    if (editingId) {
      updateProcesso(editingId, {
        titulo: formProcesso.titulo,
        descricao: formProcesso.descricao,
        status: formProcesso.status,
        clienteNome: formProcesso.clienteNome,
        contratoRef: formProcesso.contratoRef,
      });
      setEditingId(null);
    } else {
      addProcesso({
        titulo: formProcesso.titulo,
        descricao: formProcesso.descricao,
        status: formProcesso.status ?? "em_andamento",
        clienteId: "novo",
        clienteNome: formProcesso.clienteNome,
        contratoRef: formProcesso.contratoRef,
        dataCriacao: hoje,
        dataAtualizacao: hoje,
        documentos: [],
      });
    }
    setFormProcesso({
      titulo: "",
      descricao: "",
      status: "em_andamento",
      clienteNome: "",
      contratoRef: "",
    });
    setShowFormProcesso(false);
  };

  const handleSubmitAtividade = (e: React.FormEvent, processoId: string) => {
    e.preventDefault();
    if (!formAtividade.titulo || !formAtividade.responsavel || !formAtividade.prazo)
      return;
    addAtividade({
      processoId,
      titulo: formAtividade.titulo,
      descricao: formAtividade.descricao,
      responsavel: formAtividade.responsavel,
      prazo: formAtividade.prazo,
      status: formAtividade.status ?? "pendente",
      dataCriacao: new Date().toISOString().slice(0, 10),
      historico: [],
    });
    setFormAtividade({
      titulo: "",
      responsavel: "",
      prazo: new Date().toISOString().slice(0, 10),
      status: "pendente",
    });
    setShowFormAtividade(null);
  };

  const handleAddDoc = (processoId: string) => {
    if (!novoDocNome.trim()) return;
    addDocumento(processoId, {
      nome: novoDocNome.trim(),
      dataUpload: new Date().toISOString().slice(0, 10),
    });
    setNovoDocNome("");
  };

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Processos Operacionais
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Gestão de processos, vínculo com cliente/contrato e atividades
          </p>
        </div>
        <Link
          href="/operacional"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(["todos", "em_andamento", "finalizado", "cancelado"] as const).map(
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
                    {s === "todos"
                      ? "Todos"
                      : s === "em_andamento"
                        ? "Em andamento"
                        : s === "finalizado"
                          ? "Finalizado"
                          : "Cancelado"}
                  </button>
                )
              )}
            </div>
            <input
              type="search"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-48 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200"
            />
          </div>
          <button
            onClick={() => {
              setShowFormProcesso(true);
              setEditingId(null);
              setFormProcesso({
                titulo: "",
                descricao: "",
                status: "em_andamento",
                clienteNome: "",
                contratoRef: "",
              });
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            + Novo processo
          </button>
        </div>

        {showFormProcesso && (
          <form
            onSubmit={handleSubmitProcesso}
            className="glass-card space-y-5 rounded-xl p-6"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {editingId ? "Editar processo" : "Novo processo operacional"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Título
                </label>
                <input
                  required
                  value={formProcesso.titulo}
                  onChange={(e) =>
                    setFormProcesso({ ...formProcesso, titulo: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Cliente
                </label>
                <input
                  required
                  value={formProcesso.clienteNome}
                  onChange={(e) =>
                    setFormProcesso({
                      ...formProcesso,
                      clienteNome: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Ref. contrato
                </label>
                <input
                  value={formProcesso.contratoRef ?? ""}
                  onChange={(e) =>
                    setFormProcesso({
                      ...formProcesso,
                      contratoRef: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Descrição
                </label>
                <input
                  value={formProcesso.descricao ?? ""}
                  onChange={(e) =>
                    setFormProcesso({
                      ...formProcesso,
                      descricao: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                />
              </div>
              {editingId && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    value={formProcesso.status}
                    onChange={(e) =>
                      setFormProcesso({
                        ...formProcesso,
                        status: e.target.value as StatusProcessoOperacional,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                  >
                    {statusProcessoOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFormProcesso(false);
                  setEditingId(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="glass-card overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Contrato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Atualização
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
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {p.titulo}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{p.clienteNome}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {p.contratoRef ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatData(p.dataAtualizacao)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          p.status === "em_andamento" &&
                            "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                          p.status === "finalizado" &&
                            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
                          p.status === "cancelado" &&
                            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        )}
                      >
                        {p.status === "em_andamento"
                          ? "Em andamento"
                          : p.status === "finalizado"
                            ? "Finalizado"
                            : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(p.id);
                            setFormProcesso({
                              titulo: p.titulo,
                              descricao: p.descricao,
                              status: p.status,
                              clienteNome: p.clienteNome,
                              contratoRef: p.contratoRef,
                            });
                            setShowFormProcesso(true);
                          }}
                          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                        >
                          Editar
                        </button>
                        {showFormAtividade === p.id ? (
                          <button
                            type="button"
                            onClick={() => setShowFormAtividade(null)}
                            className="text-sm font-medium text-slate-500 dark:text-slate-400"
                          >
                            Ocultar tarefas
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowFormAtividade(p.id)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                          >
                            Tarefas ({getAtividadesByProcesso(p.id).length})
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel de atividades por processo */}
        {showFormAtividade &&
          filtered
            .filter((p) => p.id === showFormAtividade)
            .map((proc) => (
              <div
                key={proc.id}
                className="glass-card space-y-4 rounded-xl p-6"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Atividades · {proc.titulo}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nome do documento"
                    value={novoDocNome}
                    onChange={(e) => setNovoDocNome(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddDoc(proc.id))
                    }
                    className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDoc(proc.id)}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    + Upload doc
                  </button>
                </div>
                {proc.documentos.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {proc.documentos.map((d) => (
                      <li
                        key={d.id}
                        className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
                      >
                        {d.nome}
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  onSubmit={(e) => handleSubmitAtividade(e, proc.id)}
                  className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Tarefa
                    </label>
                    <input
                      required
                      value={formAtividade.titulo}
                      onChange={(e) =>
                        setFormAtividade({
                          ...formAtividade,
                          titulo: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Responsável
                    </label>
                    <input
                      required
                      value={formAtividade.responsavel}
                      onChange={(e) =>
                        setFormAtividade({
                          ...formAtividade,
                          responsavel: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Prazo
                    </label>
                    <input
                      type="date"
                      required
                      value={formAtividade.prazo}
                      onChange={(e) =>
                        setFormAtividade({
                          ...formAtividade,
                          prazo: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Status
                    </label>
                    <select
                      value={formAtividade.status}
                      onChange={(e) =>
                        setFormAtividade({
                          ...formAtividade,
                          status: e.target.value as StatusAtividade,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      {statusAtividadeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      + Tarefa
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-600">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Tarefa
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Responsável
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Prazo
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Status
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAtividadesByProcesso(proc.id).map((a) => (
                        <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700">
                          <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{a.titulo}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            {a.responsavel}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {formatData(a.prazo)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-xs font-medium",
                                a.status === "concluida" &&
                                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
                                a.status === "em_andamento" &&
                                  "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                                a.status === "atrasada" &&
                                  "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
                                a.status === "pendente" &&
                                  "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                              )}
                            >
                              {statusAtividadeOptions.find(
                                (o) => o.value === a.status
                              )?.label ?? a.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={a.status}
                              onChange={(e) =>
                                updateAtividade(a.id, {
                                  status: e.target.value as StatusAtividade,
                                })
                              }
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                            >
                              {statusAtividadeOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {getAtividadesByProcesso(proc.id).length > 0 && (
                  <details className="text-sm text-slate-600">
                    <summary className="cursor-pointer font-medium">
                      Histórico da última tarefa
                    </summary>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      {getAtividadesByProcesso(proc.id)[0]?.historico.map(
                        (h, i) => (
                          <li key={i}>
                            {formatData(h.data)} — {h.texto}
                            {h.usuario && ` (${h.usuario})`}
                          </li>
                        )
                      )}
                    </ul>
                  </details>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
