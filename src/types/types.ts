export interface Servico {
  id: number;
  nome: string;
  preco: number;
  tipo: "produto" | "servico";
}

export interface ServicoSelecionado extends Servico {
  quantidade: number;
}

export interface Orcamento {
  id: string;
  noiva: string;
  dataEvento: string;
  telefone: string;
  email?: string;
  observacoes?: string;
  servicos: ServicoSelecionado[];
  total: number;
  dataCriacao: string;
}

export interface FormData {
  noiva: string;
  dataEvento: string;
  telefone: string;
  email?: string;
  observacoes?: string;
}
