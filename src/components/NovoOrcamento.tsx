import React, { useState, useEffect } from "react";
import {
  Orcamento,
  ItemEstoque,
  FormaPagamento,
} from "../types/types";
import { formatarMoeda } from "../utils/formatadores";

interface NovoOrcamentoProps {
  onSalvar: (orcamento: Orcamento) => void;
  onCancelar: () => void;
}

const NovoOrcamento: React.FC<NovoOrcamentoProps> = ({
  onSalvar,
  onCancelar,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<
    "geral" | "servicos" | "pagamento"
  >("geral");

  // Estados para informações gerais
  const [nomeNoiva, setNomeNoiva] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para pagamento
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>("pix");
  const [parcelas, setParcelas] = useState(1);
  const [desconto, setDesconto] = useState(0);

  // Estados para serviços
  const [servicosDisponiveis, setServicosDisponiveis] = useState<
    ItemEstoque[]
  >([]);
  type ItemOrcamento = ItemEstoque & { quantidade?: number };

  const [servicosSelecionados, setServicosSelecionados] = useState<
    ItemOrcamento[]
  >([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Carrega serviços do localStorage
  useEffect(() => {
    const carregarServicos = () => {
      const servicosSalvos = localStorage.getItem("itensEstoque");
      if (servicosSalvos) {
        setServicosDisponiveis(JSON.parse(servicosSalvos));
      }
    };
    carregarServicos();
  }, []);

  // Calcula totais quando serviços selecionados ou pagamento mudam
  useEffect(() => {
    const novoSubtotal = servicosSelecionados.reduce(
      (total, servico) =>
        total + servico.preco * (servico.quantidade || 1),
      0
    );
    setSubtotal(novoSubtotal);

    const totalComDesconto =
      desconto > 0
        ? novoSubtotal * (1 - desconto / 100)
        : novoSubtotal;

    setTotal(totalComDesconto);
  }, [servicosSelecionados, desconto]);

  // Adiciona serviço ao orçamento
  const adicionarServico = (servico: ItemEstoque) => {
    if (
      servico.categoria === "produto" &&
      (servico.estoque || 0) <= 0
    ) {
      alert("Este produto não está disponível em estoque");
      return;
    }

    const existe = servicosSelecionados.find(
      (s) => s.id === servico.id
    );

    if (existe) {
      if (
        servico.categoria === "produto" &&
        (existe.quantidade || 1) >= (servico.estoque || 0)
      ) {
        alert("Quantidade solicitada maior que o estoque disponível");
        return;
      }

      const atualizados: ItemOrcamento[] = servicosSelecionados.map(
        (s) =>
          s.id === servico.id
            ? { ...s, quantidade: (s.quantidade ?? 1) + 1 }
            : s
      );
      setServicosSelecionados(atualizados);
    } else {
      setServicosSelecionados([
        ...servicosSelecionados,
        { ...servico, quantidade: 1 },
      ]);
    }
  };

  // Remove serviço do orçamento
  const removerServico = (id: string) => {
    setServicosSelecionados(
      servicosSelecionados.filter((s) => s.id !== id)
    );
  };

  // Atualiza quantidade de serviço
  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade < 1) return;

    const servico = servicosDisponiveis.find((s) => s.id === id);
    if (
      servico?.categoria === "produto" &&
      quantidade > (servico.estoque || 0)
    ) {
      alert("Quantidade solicitada maior que o estoque disponível");
      return;
    }

    const atualizados = servicosSelecionados.map((s) =>
      s.id === id ? { ...s, quantidade } : s
    );
    setServicosSelecionados(atualizados);
  };

  // Salva orçamento
  const handleSalvar = () => {
    if (!nomeNoiva || !cpf || !celular || !dataEvento) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (servicosSelecionados.length === 0) {
      alert("Selecione pelo menos um serviço/produto");
      setAbaAtiva("servicos");
      return;
    }

    const novoOrcamento: Orcamento = {
      id: Date.now().toString(),
      noiva: nomeNoiva,
      cpf,
      telefone: celular,
      dataEvento: new Date(dataEvento),
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      servicos: servicosSelecionados.map((s) => ({
        ...s,
        quantidade: s.quantidade ?? 1,
        tipo: s.categoria === "produto" ? "produto" : "servico",
      })),
      formaPagamento,
      total,
      observacoes,
    };

    onSalvar(novoOrcamento);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setAbaAtiva("geral")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              abaAtiva === "geral"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Informações Gerais
          </button>
          <button
            onClick={() => setAbaAtiva("servicos")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              abaAtiva === "servicos"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Serviços/Produtos
          </button>
          <button
            onClick={() => setAbaAtiva("pagamento")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              abaAtiva === "pagamento"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pagamento
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Aba Informações Gerais */}
        {abaAtiva === "geral" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Noiva *
                </label>
                <input
                  type="text"
                  value={nomeNoiva}
                  onChange={(e) => setNomeNoiva(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular *
                </label>
                <input
                  type="tel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* Aba Serviços/Produtos - Layout Dividido */}
        {abaAtiva === "servicos" && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Coluna Esquerda - Itens Disponíveis */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Serviços/Produtos Disponíveis
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-custom">
                {servicosDisponiveis.map((servico) => (
                  <div
                    key={servico.id}
                    className="border rounded-md p-3 flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h4 className="font-medium">{servico.nome}</h4>
                      <p className="text-sm text-gray-600">
                        {formatarMoeda(servico.preco)}
                        {servico.categoria === "produto" && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Estoque: {servico.estoque})
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => adicionarServico(servico)}
                      disabled={
                        servico.categoria === "produto" &&
                        (servico.estoque || 0) <= 0
                      }
                      className={`px-3 py-1 text-white text-sm rounded-md ${
                        servico.categoria === "produto" &&
                        (servico.estoque || 0) <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      {servico.categoria === "produto" &&
                      (servico.estoque || 0) <= 0
                        ? "Sem estoque"
                        : "Adicionar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna Direita - Itens Selecionados */}
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Itens Selecionados
                </h3>
                <span className="text-sm text-gray-500">
                  {servicosSelecionados.length}{" "}
                  {servicosSelecionados.length === 1
                    ? "item"
                    : "itens"}
                </span>
              </div>

              {servicosSelecionados.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Nenhum item selecionado. Clique em "Adicionar" nos
                    itens disponíveis.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-custom">
                  {servicosSelecionados.map((servico) => {
                    const servicoDisponivel =
                      servicosDisponiveis.find(
                        (s) => s.id === servico.id
                      );
                    const estoqueDisponivel =
                      servicoDisponivel?.estoque;

                    return (
                      <div
                        key={servico.id}
                        className="border rounded-md p-3 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {servico.nome}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatarMoeda(servico.preco)} cada
                            </p>
                            {servico.categoria === "produto" && (
                              <p className="text-xs text-gray-500">
                                Disponível: {estoqueDisponivel} un.
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removerServico(servico.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                atualizarQuantidade(
                                  servico.id,
                                  (servico.quantidade || 1) - 1
                                )
                              }
                              className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 bg-gray-100">
                              {servico.quantidade || 1}
                            </span>
                            <button
                              onClick={() =>
                                atualizarQuantidade(
                                  servico.id,
                                  (servico.quantidade || 1) + 1
                                )
                              }
                              disabled={
                                servico.categoria === "produto" &&
                                (servico.quantidade || 1) >=
                                  (estoqueDisponivel || 0)
                              }
                              className={`px-2 py-1 bg-gray-200 rounded-r-md transition-colors ${
                                servico.categoria === "produto" &&
                                (servico.quantidade || 1) >=
                                  (estoqueDisponivel || 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-gray-300"
                              }`}
                            >
                              +
                            </button>
                          </div>
                          <span className="font-medium">
                            {formatarMoeda(
                              servico.preco *
                                (servico.quantidade || 1)
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t pt-3 mt-4 sticky bottom-0 bg-white">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Subtotal:</span>
                      <span>{formatarMoeda(subtotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aba Pagamento */}
        {abaAtiva === "pagamento" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a forma de pagamento *
                  </label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => {
                      setFormaPagamento(
                        e.target.value as FormaPagamento
                      );
                      if (e.target.value !== "cartao") {
                        setParcelas(1);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="transferencia">
                      Transferência Bancária
                    </option>
                  </select>
                </div>

                {formaPagamento === "cartao" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parcelas *
                    </label>
                    <select
                      value={parcelas}
                      onChange={(e) =>
                        setParcelas(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}x
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={desconto > 0}
                  onChange={(e) => {
                    if (!e.target.checked) setDesconto(0);
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Aplicar desconto
                </span>
              </label>

              {desconto > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentual de desconto (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={desconto}
                    onChange={(e) =>
                      setDesconto(Number(e.target.value))
                    }
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatarMoeda(subtotal)}</span>
              </div>

              {desconto > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Desconto ({desconto}%):</span>
                  <span>
                    -{formatarMoeda(subtotal * (desconto / 100))}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total do Orçamento:</span>
                <span>{formatarMoeda(total)}</span>
              </div>

              {formaPagamento === "cartao" && parcelas > 1 && (
                <div className="text-sm text-gray-600">
                  {parcelas}x de {formatarMoeda(total / parcelas)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={onCancelar}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>

        <div className="flex space-x-3">
          {abaAtiva !== "geral" && (
            <button
              onClick={() =>
                setAbaAtiva(
                  abaAtiva === "pagamento" ? "servicos" : "geral"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
          )}

          {abaAtiva !== "pagamento" ? (
            <button
              onClick={() =>
                setAbaAtiva(
                  abaAtiva === "geral" ? "servicos" : "pagamento"
                )
              }
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSalvar}
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700"
            >
              Salvar Orçamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovoOrcamento;
