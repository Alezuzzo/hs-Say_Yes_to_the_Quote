import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ItemEstoque, CategoriaItem } from "../types/types";
import { formatarMoeda } from "../utils/formatadores";

const Estoque: React.FC = () => {
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [editandoItem, setEditandoItem] =
    useState<ItemEstoque | null>(null);
  const [novoItem, setNovoItem] = useState<Omit<ItemEstoque, "id">>({
    nome: "",
    preco: 0,
    categoria: "servico",
    estoque: 0,
  });
  const [busca, setBusca] = useState("");

  // Carrega itens do localStorage
  useEffect(() => {
    const carregarItens = () => {
      const itensSalvos = localStorage.getItem("itensEstoque");
      if (itensSalvos) {
        setItens(JSON.parse(itensSalvos));
      } else {
        // Itens padrão caso não exista no localStorage
        const defaultItens: ItemEstoque[] = [
          {
            id: "1",
            nome: "Penteado Noiva",
            preco: 200,
            categoria: "servico",
            estoque: 0,
          },
          {
            id: "2",
            nome: "Maquiagem Profissional",
            preco: 150,
            categoria: "servico",
            estoque: 0,
          },
          {
            id: "3",
            nome: "Kit Noiva",
            preco: 350,
            categoria: "produto",
            estoque: 15,
          },
        ];
        setItens(defaultItens);
        localStorage.setItem(
          "itensEstoque",
          JSON.stringify(defaultItens)
        );
      }
    };
    carregarItens();
  }, []);

  // Filtra itens pela busca
  const itensFiltrados = itens.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Salva item (cria ou edita)
  const salvarItem = () => {
    if (!novoItem.nome || novoItem.preco <= 0) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Para serviços, força estoque = 0
    const itemParaSalvar = {
      ...novoItem,
      estoque:
        novoItem.categoria === "servico" ? 0 : novoItem.estoque,
    };

    let novosItens: ItemEstoque[];

    if (editandoItem) {
      // Edição de item existente
      novosItens = itens.map((item) =>
        item.id === editandoItem.id
          ? { ...itemParaSalvar, id: editandoItem.id }
          : item
      );
    } else {
      // Criação de novo item - CORREÇÃO APLICADA AQUI
      const novoId =
        Math.max(0, ...itens.map((item) => parseInt(item.id))) + 1;
      novosItens = [
        ...itens,
        { ...itemParaSalvar, id: novoId.toString() },
      ];
    }

    setItens(novosItens);
    localStorage.setItem("itensEstoque", JSON.stringify(novosItens));
    limparFormulario();
  };

  // Prepara formulário para edição
  const editarItem = (item: ItemEstoque) => {
    setEditandoItem(item);
    setNovoItem({
      nome: item.nome,
      preco: item.preco,
      categoria: item.categoria,
      estoque: item.estoque,
    });
  };

  // Remove item
  const removerItem = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      const novosItens = itens.filter((item) => item.id !== id);
      setItens(novosItens);
      localStorage.setItem(
        "itensEstoque",
        JSON.stringify(novosItens)
      );
    }
  };

  // Limpa formulário
  const limparFormulario = () => {
    setEditandoItem(null);
    setNovoItem({
      nome: "",
      preco: 0,
      categoria: "servico",
      estoque: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Gerenciamento de Estoque
          </h1>
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Voltar para Orçamentos
          </Link>
        </header>

        {/* Formulário de cadastro/edição */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-900 mb-4">
            {editandoItem ? "Editar Item" : "Adicionar Novo Item"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={novoItem.nome}
                onChange={(e) =>
                  setNovoItem({ ...novoItem, nome: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: Maquiagem Profissional"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                value={novoItem.categoria}
                onChange={(e) =>
                  setNovoItem({
                    ...novoItem,
                    categoria: e.target.value as CategoriaItem,
                    estoque:
                      e.target.value === "servico"
                        ? 0
                        : novoItem.estoque,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="servico">Serviço</option>
                <option value="produto">Produto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={novoItem.preco}
                onChange={(e) =>
                  setNovoItem({
                    ...novoItem,
                    preco: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: 150.00"
                required
              />
            </div>

            {novoItem.categoria === "produto" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade em Estoque *
                </label>
                <input
                  type="number"
                  min="0"
                  value={novoItem.estoque}
                  onChange={(e) =>
                    setNovoItem({
                      ...novoItem,
                      estoque: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ex: 10"
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={limparFormulario}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={salvarItem}
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              {editandoItem ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>

        {/* Listagem de itens */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-purple-900">
              Itens Cadastrados
            </h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Buscar item..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itensFiltrados.length > 0 ? (
                  itensFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            item.categoria === "servico"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.categoria === "servico"
                            ? "Serviço"
                            : "Produto"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarMoeda(item.preco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.categoria === "produto" ? (
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              item.estoque > 5
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.estoque} un.
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        <button
                          onClick={() => editarItem(item)}
                          className="text-purple-600 hover:text-purple-900 mr-4 transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {busca
                        ? "Nenhum item encontrado"
                        : "Nenhum item cadastrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo do estoque (somente produtos) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500">
              Total de Itens
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {itens.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">
              Total de Produtos
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {
                itens.filter((item) => item.categoria === "produto")
                  .length
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">
              Produtos com Estoque Baixo
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {
                itens.filter(
                  (item) =>
                    item.categoria === "produto" && item.estoque <= 5
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estoque;
