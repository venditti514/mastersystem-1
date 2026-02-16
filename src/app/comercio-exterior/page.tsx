"use client";

import { useState } from "react";
import { useComexStore } from "@/lib/store-comex";
import { formatMoeda, formatData } from "@/lib/format";
import type {
  Importacao,
  Exportacao,
  ControleAduaneiro,
  ModalidadeTransporte,
  Moeda,
  CanalAduaneiro,
  StatusDesembaraco,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type AbaComex = "importacao" | "exportacao" | "aduaneiro";

const modalidadeLabels: Record<ModalidadeTransporte, string> = {
  maritimo: "Marítimo",
  aereo: "Aéreo",
  rodoviario: "Rodoviário",
};

const canalLabels: Record<CanalAduaneiro, string> = {
  verde: "Verde",
  amarelo: "Amarelo",
  vermelho: "Vermelho",
};

const statusDesembaracoLabels: Record<StatusDesembaraco, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  desembaracado: "Desembaraçado",
  retenido: "Retido",
};

export default function ComercioExteriorPage() {
  const [aba, setAba] = useState<AbaComex>("importacao");

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Comércio Exterior
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Gestão de Importação, Exportação e Controle Aduaneiro
        </p>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["importacao", "Importação"],
            ["exportacao", "Exportação"],
            ["aduaneiro", "Controle Aduaneiro"],
          ] as [AbaComex, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              aba === key
                ? "border border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === "importacao" && <AbaImportacao />}
      {aba === "exportacao" && <AbaExportacao />}
      {aba === "aduaneiro" && <AbaAduaneiro />}
    </div>
  );
}

function AbaImportacao() {
  const {
    importacoes,
    addImportacao,
    updateImportacao,
  } = useComexStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Importacao>>({
    numeroProcesso: "",
    fornecedorInternacional: "",
    incoterm: "",
    modalidade: "maritimo",
    moeda: "USD",
    valorFOB: 0,
    valorCIF: 0,
    dataEmbarque: "",
    dataPrevistaChegada: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.numeroProcesso ||
      !form.fornecedorInternacional ||
      !form.incoterm ||
      !form.dataEmbarque ||
      !form.dataPrevistaChegada
    )
      return;
    addImportacao({
      numeroProcesso: form.numeroProcesso,
      fornecedorInternacional: form.fornecedorInternacional,
      incoterm: form.incoterm,
      modalidade: form.modalidade ?? "maritimo",
      moeda: form.moeda ?? "USD",
      valorFOB: form.valorFOB ?? 0,
      valorCIF: form.valorCIF ?? 0,
      dataEmbarque: form.dataEmbarque,
      dataPrevistaChegada: form.dataPrevistaChegada,
      dataCriacao: new Date().toISOString().slice(0, 10),
    });
    setForm({
      numeroProcesso: "",
      fornecedorInternacional: "",
      incoterm: "",
      modalidade: "maritimo",
      moeda: "USD",
      valorFOB: 0,
      valorCIF: 0,
      dataEmbarque: "",
      dataPrevistaChegada: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          {showForm ? "Cancelar" : "+ Nova importação"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card space-y-5 rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Nova importação
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Número do processo
              </label>
              <input
                required
                value={form.numeroProcesso}
                onChange={(e) =>
                  setForm({ ...form, numeroProcesso: e.target.value })
                }
                placeholder="IMP-2025-003"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Fornecedor internacional
              </label>
              <input
                required
                value={form.fornecedorInternacional}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fornecedorInternacional: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Incoterm
              </label>
              <input
                required
                value={form.incoterm}
                onChange={(e) =>
                  setForm({ ...form, incoterm: e.target.value })
                }
                placeholder="CIF Santos, FOB..."
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Modalidade
              </label>
              <select
                value={form.modalidade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    modalidade: e.target.value as ModalidadeTransporte,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              >
                <option value="maritimo">Marítimo</option>
                <option value="aereo">Aéreo</option>
                <option value="rodoviario">Rodoviário</option>
              </select>
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
                Valor FOB
              </label>
              <input
                type="number"
                step="0.01"
                value={form.valorFOB ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    valorFOB: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Valor CIF
              </label>
              <input
                type="number"
                step="0.01"
                value={form.valorCIF ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    valorCIF: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Data embarque
              </label>
              <input
                type="date"
                required
                value={form.dataEmbarque}
                onChange={(e) =>
                  setForm({ ...form, dataEmbarque: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Data prevista chegada
              </label>
              <input
                type="date"
                required
                value={form.dataPrevistaChegada}
                onChange={(e) =>
                  setForm({ ...form, dataPrevistaChegada: e.target.value })
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
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Processo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Incoterm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Modalidade
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  FOB / CIF
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Embarque / Chegada
                </th>
              </tr>
            </thead>
            <tbody>
              {importacoes.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {i.numeroProcesso}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                    {i.fornecedorInternacional}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{i.incoterm}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {modalidadeLabels[i.modalidade]}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="tabular-nums text-slate-900 dark:text-slate-100">
                      {formatMoeda(i.valorFOB, i.moeda)} /{" "}
                      {formatMoeda(i.valorCIF, i.moeda)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {formatData(i.dataEmbarque)} →{" "}
                    {formatData(i.dataPrevistaChegada)}
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

function AbaExportacao() {
  const { exportacoes, addExportacao } = useComexStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Exportacao>>({
    numeroProcesso: "",
    clienteInternacional: "",
    paisDestino: "",
    ncm: "",
    documentos: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.numeroProcesso ||
      !form.clienteInternacional ||
      !form.paisDestino ||
      !form.ncm
    )
      return;
    addExportacao({
      numeroProcesso: form.numeroProcesso,
      clienteInternacional: form.clienteInternacional,
      paisDestino: form.paisDestino,
      ncm: form.ncm,
      documentos: [],
      dataCriacao: new Date().toISOString().slice(0, 10),
    });
    setForm({
      numeroProcesso: "",
      clienteInternacional: "",
      paisDestino: "",
      ncm: "",
      documentos: [],
    });
    setShowForm(false);
  };

  const docTipoLabel = (tipo: string) =>
    tipo === "invoice"
      ? "Invoice"
      : tipo === "packing_list"
        ? "Packing List"
        : "BL/AWB";

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          {showForm ? "Cancelar" : "+ Nova exportação"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card space-y-5 rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Nova exportação
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Número do processo
              </label>
              <input
                required
                value={form.numeroProcesso}
                onChange={(e) =>
                  setForm({ ...form, numeroProcesso: e.target.value })
                }
                placeholder="EXP-2025-003"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Cliente internacional
              </label>
              <input
                required
                value={form.clienteInternacional}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clienteInternacional: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                País destino
              </label>
              <input
                required
                value={form.paisDestino}
                onChange={(e) =>
                  setForm({ ...form, paisDestino: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                NCM
              </label>
              <input
                required
                value={form.ncm}
                onChange={(e) => setForm({ ...form, ncm: e.target.value })}
                placeholder="4703.21.00"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Documentos (Invoice, Packing List, BL/AWB) podem ser anexados após
            salvar.
          </p>
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
                  Processo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  País
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  NCM
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Documentos
                </th>
              </tr>
            </thead>
            <tbody>
              {exportacoes.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {e.numeroProcesso}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                    {e.clienteInternacional}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{e.paisDestino}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                    {e.ncm}
                  </td>
                  <td className="px-6 py-4">
                    {e.documentos.length === 0 ? (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    ) : (
                      <ul className="flex flex-wrap gap-1">
                        {e.documentos.map((d) => (
                          <li
                            key={d.id}
                            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {docTipoLabel(d.tipo)}: {d.nome}
                          </li>
                        ))}
                      </ul>
                    )}
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

function AbaAduaneiro() {
  const {
    controlesAduaneiros,
    addControleAduaneiro,
    updateControleAduaneiro,
  } = useComexStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ControleAduaneiro>>({
    numeroDI: "",
    statusDesembaraco: "pendente",
    canal: "verde",
    tributosEstimados: 0,
    tributosPagos: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.numeroDI) return;
    addControleAduaneiro({
      numeroDI: form.numeroDI,
      importacaoId: form.importacaoId,
      statusDesembaraco: form.statusDesembaraco ?? "pendente",
      canal: form.canal ?? "verde",
      tributosEstimados: form.tributosEstimados ?? 0,
      tributosPagos: form.tributosPagos ?? 0,
      dataDesembaraco: form.dataDesembaraco,
      dataCriacao: new Date().toISOString().slice(0, 10),
    });
    setForm({
      numeroDI: "",
      statusDesembaraco: "pendente",
      canal: "verde",
      tributosEstimados: 0,
      tributosPagos: 0,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          {showForm ? "Cancelar" : "+ Novo controle aduaneiro"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card space-y-5 rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Novo controle aduaneiro
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Número DI
              </label>
              <input
                required
                value={form.numeroDI}
                onChange={(e) =>
                  setForm({ ...form, numeroDI: e.target.value })
                }
                placeholder="DI 12345"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Status desembaraço
              </label>
              <select
                value={form.statusDesembaraco}
                onChange={(e) =>
                  setForm({
                    ...form,
                    statusDesembaraco: e.target.value as StatusDesembaraco,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              >
                {(
                  Object.entries(statusDesembaracoLabels) as [
                    StatusDesembaraco,
                    string,
                  ][]
                ).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Canal
              </label>
              <select
                value={form.canal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    canal: e.target.value as CanalAduaneiro,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              >
                <option value="verde">Verde</option>
                <option value="amarelo">Amarelo</option>
                <option value="vermelho">Vermelho</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Tributos estimados (BRL)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.tributosEstimados ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tributosEstimados: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Tributos pagos (BRL)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.tributosPagos ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tributosPagos: parseFloat(e.target.value) || 0,
                  })
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
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  DI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status desembaraço
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Canal
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tributos estimados
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tributos pagos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Data desembaraço
                </th>
              </tr>
            </thead>
            <tbody>
              {controlesAduaneiros.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {c.numeroDI ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        c.statusDesembaraco === "desembaracado" &&
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
                        c.statusDesembaraco === "em_analise" &&
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                        c.statusDesembaraco === "pendente" &&
                          "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                        c.statusDesembaraco === "retenido" &&
                          "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"
                      )}
                    >
                      {statusDesembaracoLabels[c.statusDesembaraco]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-medium",
                        c.canal === "verde" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
                        c.canal === "amarelo" &&
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                        c.canal === "vermelho" && "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"
                      )}
                    >
                      {canalLabels[c.canal]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatMoeda(c.tributosEstimados, "BRL")}
                  </td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatMoeda(c.tributosPagos, "BRL")}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {c.dataDesembaraco
                      ? formatData(c.dataDesembaraco)
                      : "—"}
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
