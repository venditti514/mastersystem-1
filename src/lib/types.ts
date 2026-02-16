export type Moeda = "BRL" | "USD" | "EUR";

export type StatusPagar = "pendente" | "pago" | "vencido" | "agendado";
export type StatusReceber = "a_receber" | "recebido" | "em_atraso";

export type TipoOperacao = "importacao" | "exportacao" | "nacional";

export interface ContaPagar {
  id: string;
  descricao: string;
  fornecedor: string;
  vencimento: string;
  valor: number;
  moeda: Moeda;
  status: StatusPagar;
  tipo: TipoOperacao;
  nrOperacao?: string;
}

export interface ContaReceber {
  id: string;
  cliente: string;
  descricao: string;
  vencimento: string;
  valor: number;
  moeda: Moeda;
  status: StatusReceber;
  tipo: TipoOperacao;
  nrOperacao?: string;
}

export interface OperacaoComex {
  id: string;
  numero: string;
  tipo: TipoOperacao;
  descricao: string;
  valorOriginal: number;
  moeda: Moeda;
  valorBRL: number;
  cotacao: number;
  dataOperacao: string;
  status: "em_andamento" | "liquidado" | "cancelado";
  incoterm?: string;
}

export interface CotacaoCambio {
  moeda: Moeda;
  compra: number;
  venda: number;
  data: string;
}

export interface LancamentoFluxo {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  moeda: Moeda;
  categoria: string;
}

// ---- Módulo Operacional ----
export type StatusProcessoOperacional = "em_andamento" | "finalizado" | "cancelado";
export type StatusAtividade = "pendente" | "em_andamento" | "concluida" | "atrasada";

export interface DocumentoProcesso {
  id: string;
  nome: string;
  url?: string;
  dataUpload: string;
}

export interface ProcessoOperacional {
  id: string;
  titulo: string;
  descricao?: string;
  status: StatusProcessoOperacional;
  clienteId: string;
  clienteNome: string;
  contratoId?: string;
  contratoRef?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  documentos: DocumentoProcesso[];
}

export interface Atividade {
  id: string;
  processoId: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prazo: string;
  status: StatusAtividade;
  dataCriacao: string;
  historico: { data: string; texto: string; usuario?: string }[];
}

// ---- Módulo Comércio Exterior (detalhado) ----
export type ModalidadeTransporte = "maritimo" | "aereo" | "rodoviario";
export type CanalAduaneiro = "verde" | "amarelo" | "vermelho";
export type StatusDesembaraco = "pendente" | "em_analise" | "desembaracado" | "retenido";

export interface Importacao {
  id: string;
  numeroProcesso: string;
  fornecedorInternacional: string;
  incoterm: string;
  modalidade: ModalidadeTransporte;
  moeda: Moeda;
  valorFOB: number;
  valorCIF: number;
  dataEmbarque: string;
  dataPrevistaChegada: string;
  status?: string;
  dataCriacao: string;
}

export interface DocumentoExportacao {
  id: string;
  tipo: "invoice" | "packing_list" | "bl_awb";
  nome: string;
  url?: string;
}

export interface Exportacao {
  id: string;
  numeroProcesso: string;
  clienteInternacional: string;
  paisDestino: string;
  ncm: string;
  documentos: DocumentoExportacao[];
  dataCriacao: string;
  status?: string;
}

export interface ControleAduaneiro {
  id: string;
  numeroDI?: string;
  importacaoId?: string;
  statusDesembaraco: StatusDesembaraco;
  canal: CanalAduaneiro;
  tributosEstimados: number;
  tributosPagos: number;
  dataDesembaraco?: string;
  dataCriacao: string;
}
