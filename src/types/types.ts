export type FormaPagamento =
  | "pix"
  | "avista"
  | "entrada"
  | "cartao"
  | "boleto";

export type CategoriaItem = "servico" | "produto";

// Item disponível no estoque
export interface ItemEstoque {
  id: string;
  nome: string;
  preco: number;
  categoria: CategoriaItem;
  estoque: number;
}

// Item selecionado para orçamento
export interface ServicoSelecionado {
  id: string | number;
  nome: string;
  preco: number;
  quantidade: number;
  tipo: CategoriaItem | string;
  categoria?: CategoriaItem | string;
}

// Serviço usado no orçamento
export interface Servico {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  tipo: CategoriaItem;
  categoria: CategoriaItem;
  estoque?: number;
}

export type Orcamento = {
  id: string;
  noiva: string;
  dataEvento: Date;
  telefone: string;
  email?: string;
  observacoes?: string;
  servicos: Servico[];
  total: number;
  dataCriacao: Date;
  formaPagamento: FormaPagamento;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataAtualizacao: Date;
};

// Tipos específicos para formulários
export type OrcamentoFormFields = {
  noiva: string;
  dataEvento: Date;
  telefone: string;
  email: string;
  observacoes: string;
  servicos?: Servico[]; // Opcional no formulário
};

export type ServicoFormFields = {
  id?: string;
  nome: string;
  preco: number;
  tipo: CategoriaItem;
  estoque?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
