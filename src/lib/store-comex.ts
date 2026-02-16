import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Importacao,
  Exportacao,
  ControleAduaneiro,
  ModalidadeTransporte,
  Moeda,
  CanalAduaneiro,
  StatusDesembaraco,
} from "./types";

const importacoesInicial: Importacao[] = [
  {
    id: "imp1",
    numeroProcesso: "IMP-2025-001",
    fornecedorInternacional: "Steel Corp USA",
    incoterm: "CIF Santos",
    modalidade: "maritimo",
    moeda: "USD",
    valorFOB: 42000,
    valorCIF: 48500,
    dataEmbarque: "2025-01-20",
    dataPrevistaChegada: "2025-02-18",
    dataCriacao: "2025-01-15",
  },
  {
    id: "imp2",
    numeroProcesso: "IMP-2025-002",
    fornecedorInternacional: "Chemicals EU GmbH",
    incoterm: "FOB Hamburg",
    modalidade: "maritimo",
    moeda: "EUR",
    valorFOB: 28000,
    valorCIF: 31500,
    dataEmbarque: "2025-02-01",
    dataPrevistaChegada: "2025-03-05",
    dataCriacao: "2025-01-28",
  },
];

const exportacoesInicial: Exportacao[] = [
  {
    id: "exp1",
    numeroProcesso: "EXP-2025-002",
    clienteInternacional: "Trading Co Europe",
    paisDestino: "Alemanha",
    ncm: "4703.21.00",
    documentos: [
      { id: "doc1", tipo: "invoice", nome: "Invoice_EXP-2025-002.pdf" },
      { id: "doc2", tipo: "packing_list", nome: "PackingList_EXP-2025-002.pdf" },
    ],
    dataCriacao: "2025-02-05",
  },
];

const controlesAduaneirosInicial: ControleAduaneiro[] = [
  {
    id: "adu1",
    numeroDI: "DI 12345",
    importacaoId: "imp1",
    statusDesembaraco: "em_analise",
    canal: "amarelo",
    tributosEstimados: 28900,
    tributosPagos: 0,
    dataCriacao: "2025-02-10",
  },
  {
    id: "adu2",
    numeroDI: "DI 12340",
    statusDesembaraco: "desembaracado",
    canal: "verde",
    tributosEstimados: 15200,
    tributosPagos: 15200,
    dataDesembaraco: "2025-01-28",
    dataCriacao: "2025-01-20",
  },
];

interface ComexStore {
  importacoes: Importacao[];
  exportacoes: Exportacao[];
  controlesAduaneiros: ControleAduaneiro[];

  addImportacao: (i: Omit<Importacao, "id">) => void;
  updateImportacao: (id: string, i: Partial<Importacao>) => void;
  removeImportacao: (id: string) => void;

  addExportacao: (e: Omit<Exportacao, "id">) => void;
  updateExportacao: (id: string, e: Partial<Exportacao>) => void;
  removeExportacao: (id: string) => void;

  addControleAduaneiro: (c: Omit<ControleAduaneiro, "id">) => void;
  updateControleAduaneiro: (id: string, c: Partial<ControleAduaneiro>) => void;
  removeControleAduaneiro: (id: string) => void;
}

export const useComexStore = create<ComexStore>()(
  persist(
    (set) => ({
      importacoes: importacoesInicial,
      exportacoes: exportacoesInicial,
      controlesAduaneiros: controlesAduaneirosInicial,

      addImportacao: (i) =>
        set((s) => ({
          importacoes: [
            ...s.importacoes,
            { ...i, id: crypto.randomUUID() },
          ],
        })),

      updateImportacao: (id, i) =>
        set((s) => ({
          importacoes: s.importacoes.map((imp) =>
            imp.id === id ? { ...imp, ...i } : imp
          ),
        })),

      removeImportacao: (id) =>
        set((s) => ({
          importacoes: s.importacoes.filter((imp) => imp.id !== id),
        })),

      addExportacao: (e) =>
        set((s) => ({
          exportacoes: [
            ...s.exportacoes,
            { ...e, id: crypto.randomUUID(), documentos: e.documentos ?? [] },
          ],
        })),

      updateExportacao: (id, e) =>
        set((s) => ({
          exportacoes: s.exportacoes.map((exp) =>
            exp.id === id ? { ...exp, ...e } : exp
          ),
        })),

      removeExportacao: (id) =>
        set((s) => ({
          exportacoes: s.exportacoes.filter((exp) => exp.id !== id),
        })),

      addControleAduaneiro: (c) =>
        set((s) => ({
          controlesAduaneiros: [
            ...s.controlesAduaneiros,
            { ...c, id: crypto.randomUUID() },
          ],
        })),

      updateControleAduaneiro: (id, c) =>
        set((s) => ({
          controlesAduaneiros: s.controlesAduaneiros.map((ctrl) =>
            ctrl.id === id ? { ...ctrl, ...c } : ctrl
          ),
        })),

      removeControleAduaneiro: (id) =>
        set((s) => ({
          controlesAduaneiros: s.controlesAduaneiros.filter((ctrl) => ctrl.id !== id),
        })),
    }),
    { name: "comex-store" }
  )
);
