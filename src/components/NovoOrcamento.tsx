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
  // Estados unificados para melhor organização
  const [formData, setFormData] = useState({
    nomeNoiva: "",
    cpf: "",
    celular: "",
    dataEvento: "",
    observacoes: "",
    formaPagamento: "pix" as FormaPagamento,
    parcelas: 1,
    desconto: 0,
  });

  const [servicosDisponiveis, setServicosDisponiveis] = useState<
    ItemEstoque[]
  >([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<
    (ItemEstoque & { quantidade: number })[]
  >([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState<
    "geral" | "servicos" | "pagamento"
  >("geral");

  // Carrega serviços do localStorage
  useEffect(() => {
    const servicosSalvos = localStorage.getItem("itensEstoque");
    if (servicosSalvos)
      setServicosDisponiveis(JSON.parse(servicosSalvos));
  }, []);

  // Calcula totais
  useEffect(() => {
    const novoSubtotal = servicosSelecionados.reduce(
      (total, servico) => total + servico.preco * servico.quantidade,
      0
    );
    setSubtotal(novoSubtotal);
    setTotal(novoSubtotal * (1 - formData.desconto / 100));
  }, [servicosSelecionados, formData.desconto]);

  // Manipulador genérico para inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "parcelas" || name === "desconto"
          ? Number(value)
          : value,
    }));
  };

  // Adiciona serviço ao orçamento
  const adicionarServico = (servico: ItemEstoque) => {
    if (servico.categoria === "produto" && servico.estoque <= 0) {
      alert("Produto sem estoque disponível");
      return;
    }

    setServicosSelecionados((prev) => {
      const existe = prev.find((s) => s.id === servico.id);
      if (existe) {
        if (
          servico.categoria === "produto" &&
          existe.quantidade >= servico.estoque
        ) {
          alert("Quantidade excede estoque disponível");
          return prev;
        }
        return prev.map((s) =>
          s.id === servico.id
            ? { ...s, quantidade: s.quantidade + 1 }
            : s
        );
      }
      return [...prev, { ...servico, quantidade: 1 }];
    });
  };

  // Remove serviço
  const removerServico = (id: string) => {
    setServicosSelecionados((prev) =>
      prev.filter((s) => s.id !== id)
    );
  };

  // Atualiza quantidade
  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade < 1) return;

    const servico = servicosDisponiveis.find((s) => s.id === id);
    if (
      servico?.categoria === "produto" &&
      quantidade > servico.estoque
    ) {
      alert("Quantidade excede estoque");
      return;
    }

    setServicosSelecionados((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantidade } : s))
    );
  };

  // Salva orçamento
  const handleSalvar = () => {
    const { nomeNoiva, cpf, celular, dataEvento } = formData;
    if (!nomeNoiva || !cpf || !celular || !dataEvento) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    if (servicosSelecionados.length === 0) {
      alert("Adicione pelo menos um item");
      setAbaAtiva("servicos");
      return;
    }

    onSalvar({
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
      servicos: servicosSelecionados,
      formaPagamento: formData.formaPagamento,
      total,
      observacoes: formData.observacoes,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabeçalho com abas */}
        <div className="flex border-b border-gray-200">
          {(["geral", "servicos", "pagamento"] as const).map(
            (aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`flex-1 py-5 font-medium text-sm transition-all ${
                  abaAtiva === aba
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {aba === "geral" && "Informações"}
                {aba === "servicos" && "Serviços"}
                {aba === "pagamento" && "Pagamento"}
              </button>
            )
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-8">
          {/* Aba Informações */}
          {abaAtiva === "geral" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Informações da Noiva
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Nome da Noiva *
                  </label>
                  <input
                    name="nomeNoiva"
                    value={formData.nomeNoiva}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    CPF *
                  </label>
                  <input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Celular *
                  </label>
                  <input
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    name="dataEvento"
                    value={formData.dataEvento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-500">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                />
              </div>
            </div>
          )}

          {/* Aba Serviços */}
          {abaAtiva === "servicos" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-light text-gray-800">
                Serviços e Produtos
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Itens Disponíveis */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Disponíveis
                  </h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {servicosDisponiveis.map((servico) => (
                      <div
                        key={servico.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium">
                            {servico.nome}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-purple-600 font-medium">
                              {formatarMoeda(servico.preco)}
                            </span>
                            {servico.categoria === "produto" && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                {servico.estoque} em estoque
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => adicionarServico(servico)}
                          disabled={
                            servico.categoria === "produto" &&
                            servico.estoque <= 0
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            servico.categoria === "produto" &&
                            servico.estoque <= 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                        >
                          Adicionar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itens Selecionados */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Selecionados
                    </h3>
                    <span className="text-sm text-gray-500">
                      {servicosSelecionados.length}{" "}
                      {servicosSelecionados.length === 1
                        ? "item"
                        : "itens"}
                    </span>
                  </div>

                  {servicosSelecionados.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <p className="text-gray-400">
                        Nenhum item selecionado
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {servicosSelecionados.map((servico) => {
                        const estoque =
                          servicosDisponiveis.find(
                            (s) => s.id === servico.id
                          )?.estoque || 0;

                        return (
                          <div
                            key={servico.id}
                            className="bg-gray-50 rounded-xl p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {servico.nome}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatarMoeda(servico.preco)} cada
                                </p>
                                {servico.categoria === "produto" && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Disponível: {estoque} un.
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  removerServico(servico.id)
                                }
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remover
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center bg-white rounded-full p-1 shadow-inner">
                                <button
                                  onClick={() =>
                                    atualizarQuantidade(
                                      servico.id,
                                      servico.quantidade - 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="mx-3 w-6 text-center">
                                  {servico.quantidade}
                                </span>
                                <button
                                  onClick={() =>
                                    atualizarQuantidade(
                                      servico.id,
                                      servico.quantidade + 1
                                    )
                                  }
                                  disabled={
                                    servico.categoria === "produto" &&
                                    servico.quantidade >= estoque
                                  }
                                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                    servico.categoria === "produto" &&
                                    servico.quantidade >= estoque
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  +
                                </button>
                              </div>

                              <span className="font-medium">
                                {formatarMoeda(
                                  servico.preco * servico.quantidade
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      <div className="bg-white p-4 rounded-xl border border-gray-200 sticky bottom-0">
                        <div className="flex justify-between font-medium">
                          <span>Subtotal:</span>
                          <span>{formatarMoeda(subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Aba Pagamento */}
          {abaAtiva === "pagamento" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-light text-gray-800">
                Pagamento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Forma de Pagamento *
                  </label>
                  <select
                    name="formaPagamento"
                    value={formData.formaPagamento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                  >
                    <option value="pix">PIX</option>
                    <option value="avista">À Vista</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>

                {formData.formaPagamento === "cartao" && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      Parcelas *
                    </label>
                    <select
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-0 border-b border-gray-200 focus:border-purple-500 focus:ring-0 text-lg"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}x de {formatarMoeda(total / num)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.desconto > 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desconto: e.target.checked ? 10 : 0,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
                        formData.desconto > 0
                          ? "bg-purple-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.desconto > 0 ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">
                    Aplicar desconto
                  </span>
                </label>

                {formData.desconto > 0 && (
                  <div className="pl-16 space-y-2">
                    <input
                      type="range"
                      name="desconto"
                      min="0"
                      max="30"
                      step="5"
                      value={formData.desconto}
                      onChange={handleChange}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0%</span>
                      <span className="text-purple-600 font-medium">
                        {formData.desconto}%
                      </span>
                      <span>30%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatarMoeda(subtotal)}</span>
                </div>

                {formData.desconto > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>Desconto ({formData.desconto}%):</span>
                    <span>
                      -
                      {formatarMoeda(
                        (subtotal * formData.desconto) / 100
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatarMoeda(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com ações */}
        <div className="bg-gray-50 px-6 py-5 border-t border-gray-200 flex justify-between">
          <button
            onClick={onCancelar}
            className="px-8 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex gap-4">
            {abaAtiva !== "geral" && (
              <button
                onClick={() =>
                  setAbaAtiva(
                    abaAtiva === "pagamento" ? "servicos" : "geral"
                  )
                }
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
            )}

            {abaAtiva !== "pagamento" ? (
              <button
                onClick={() =>
                  setAbaAtiva(
                    abaAtiva === "geral" ? "servicos" : "pagamento"
                  )
                }
                className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSalvar}
                className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Finalizar Orçamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoOrcamento;
