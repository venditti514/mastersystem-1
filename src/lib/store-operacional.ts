import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ProcessoOperacional,
  Atividade,
  DocumentoProcesso,
} from "./types";

const processosInicial: ProcessoOperacional[] = [
  {
    id: "1",
    titulo: "Processo Logístico Q1 - Steel Corp",
    descricao: "Acompanhamento importação aço carbono",
    status: "em_andamento",
    clienteId: "c1",
    clienteNome: "Steel Corp USA",
    contratoRef: "CT-2025-001",
    dataCriacao: "2025-02-01",
    dataAtualizacao: "2025-02-14",
    documentos: [
      { id: "d1", nome: "DI_12345.pdf", dataUpload: "2025-02-10" },
    ],
  },
  {
    id: "2",
    titulo: "Exportação Celulose - Europa",
    descricao: "Processo de exportação Trading Co Europe",
    status: "em_andamento",
    clienteId: "c2",
    clienteNome: "Trading Co Europe",
    contratoRef: "CT-2025-002",
    dataCriacao: "2025-02-05",
    dataAtualizacao: "2025-02-12",
    documentos: [],
  },
  {
    id: "3",
    titulo: "Desembaraço DI 12345",
    status: "finalizado",
    clienteId: "c1",
    clienteNome: "Steel Corp USA",
    dataCriacao: "2025-01-15",
    dataAtualizacao: "2025-02-01",
    documentos: [],
  },
];

const atividadesInicial: Atividade[] = [
  {
    id: "a1",
    processoId: "1",
    titulo: "Conferir documentação aduaneira",
    responsavel: "Maria Silva",
    prazo: "2025-02-18",
    status: "em_andamento",
    dataCriacao: "2025-02-10",
    historico: [
      { data: "2025-02-10", texto: "Tarefa criada", usuario: "Sistema" },
      { data: "2025-02-12", texto: "Iniciada análise dos documentos", usuario: "Maria Silva" },
    ],
  },
  {
    id: "a2",
    processoId: "1",
    titulo: "Agendar inspeção de carga",
    responsavel: "João Santos",
    prazo: "2025-02-20",
    status: "pendente",
    dataCriacao: "2025-02-11",
    historico: [{ data: "2025-02-11", texto: "Tarefa criada", usuario: "Sistema" }],
  },
  {
    id: "a3",
    processoId: "2",
    titulo: "Emitir Invoice e Packing List",
    responsavel: "Ana Costa",
    prazo: "2025-02-15",
    status: "concluida",
    dataCriacao: "2025-02-05",
    historico: [
      { data: "2025-02-05", texto: "Tarefa criada", usuario: "Sistema" },
      { data: "2025-02-14", texto: "Documentos emitidos e enviados", usuario: "Ana Costa" },
    ],
  },
];

interface OperacionalStore {
  processos: ProcessoOperacional[];
  atividades: Atividade[];

  addProcesso: (p: Omit<ProcessoOperacional, "id">) => void;
  updateProcesso: (id: string, p: Partial<ProcessoOperacional>) => void;
  removeProcesso: (id: string) => void;
  addDocumento: (processoId: string, doc: Omit<DocumentoProcesso, "id">) => void;

  addAtividade: (a: Omit<Atividade, "id">) => void;
  updateAtividade: (id: string, a: Partial<Atividade>) => void;
  removeAtividade: (id: string) => void;
  addHistoricoAtividade: (atividadeId: string, texto: string, usuario?: string) => void;
}

export const useOperacionalStore = create<OperacionalStore>()(
  persist(
    (set) => ({
      processos: processosInicial,
      atividades: atividadesInicial,

      addProcesso: (p) =>
        set((s) => {
          const hoje = new Date().toISOString().slice(0, 10);
          return {
            processos: [
              ...s.processos,
              {
                ...p,
                id: crypto.randomUUID(),
                documentos: p.documentos ?? [],
                dataCriacao: p.dataCriacao ?? hoje,
                dataAtualizacao: hoje,
              },
            ],
          };
        }),

      updateProcesso: (id, p) =>
        set((s) => ({
          processos: s.processos.map((proc) =>
            proc.id === id
              ? {
                  ...proc,
                  ...p,
                  dataAtualizacao: new Date().toISOString().slice(0, 10),
                }
              : proc
          ),
        })),

      removeProcesso: (id) =>
        set((s) => ({
          processos: s.processos.filter((proc) => proc.id !== id),
          atividades: s.atividades.filter((a) => a.processoId !== id),
        })),

      addDocumento: (processoId, doc) =>
        set((s) => ({
          processos: s.processos.map((proc) =>
            proc.id === processoId
              ? {
                  ...proc,
                  documentos: [
                    ...proc.documentos,
                    { ...doc, id: crypto.randomUUID() },
                  ],
                }
              : proc
          ),
        })),

      addAtividade: (a) =>
        set((s) => ({
          atividades: [
            ...s.atividades,
            {
              ...a,
              id: crypto.randomUUID(),
              historico: a.historico ?? [{ data: new Date().toISOString().slice(0, 10), texto: "Tarefa criada", usuario: "Sistema" }],
            },
          ],
        })),

      updateAtividade: (id, a) =>
        set((s) => ({
          atividades: s.atividades.map((at) =>
            at.id === id ? { ...at, ...a } : at
          ),
        })),

      removeAtividade: (id) =>
        set((s) => ({
          atividades: s.atividades.filter((at) => at.id !== id),
        })),

      addHistoricoAtividade: (atividadeId, texto, usuario) =>
        set((s) => ({
          atividades: s.atividades.map((at) =>
            at.id === atividadeId
              ? {
                  ...at,
                  historico: [
                    ...at.historico,
                    {
                      data: new Date().toISOString().slice(0, 10),
                      texto,
                      usuario: usuario ?? "Sistema",
                    },
                  ],
                }
              : at
          ),
        })),
    }),
    { name: "operacional-store" }
  )
);
