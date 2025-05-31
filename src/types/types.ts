export type FormaPagamento =
  | "pix"
  | "avista"
  | "entrada"
  | "cartao"
  | "boleto";

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  estoque?: number; // Opcional para manter compatibilidade
}

export interface Orcamento {
  id: string;
  noiva: string;
  cpf: string;
  endereco: string;
  telefone: string;
  cidade: string;
  pais: string;
  email?: string;
  observacoes?: string;
  dataEvento: Date;
  dataFim: Date;
  dataCriacao: Date;
  servicos: Servico[];
  formaPagamento: FormaPagamento;
  parcelas: number;
  desconto: number;
  total: number;
}

export type CategoriaItem = "servico" | "produto";

export interface ItemEstoque {
  id: string;
  nome: string;
  preco: number;
  categoria: CategoriaItem;
  estoque: number;
  quantidade?: number; // Opcional para uso em orçamentos
}
